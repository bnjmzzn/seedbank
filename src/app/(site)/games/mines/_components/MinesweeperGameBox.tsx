"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { animate, utils, cubicBezier } from "animejs";
import { playSfx } from "@/lib/client/sfx";
import type { GameResult } from "@/types/api";

// --- Types ---

type TileState = "hidden" | "safe" | "bomb";

// --- Constants ---

const GRID_SIZE = 25;
const MAX_SELECTIONS = 4;
const BOMB_COUNT = 7;
const JOKE_CHANCE = 0.03;
const SELECTED_REVEAL_STAGGER = 120;
const POST_SELECTED_PAUSE = 600;
const OTHER_TILE_STAGGER = 60;
const SETTLE_DELAY = 400;
const FLIP_DURATION = 400;
const FLIP_EASE = cubicBezier(0.45, 0.05, 0.55, 0.95);

// --- Helpers ---

function pickRandomIndices(pool: number[], count: number): number[] {
    const shuffled = [...pool];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }

    return shuffled.slice(0, count);
}

function buildWinTiles(selected: number[]): TileState[] {
    const tiles: TileState[] = Array(GRID_SIZE).fill("safe");
    const remainingPool = [...Array(GRID_SIZE).keys()].filter((index) => !selected.includes(index));
    const bombIndices = pickRandomIndices(remainingPool, BOMB_COUNT);

    for (const index of bombIndices) {
        tiles[index] = "bomb";
    }

    return tiles;
}

function buildLoseTilesNormal(selected: number[]): TileState[] {
    const tiles: TileState[] = Array(GRID_SIZE).fill("safe");
    const bombedSelectedIndex = selected[Math.floor(Math.random() * selected.length)];

    tiles[bombedSelectedIndex] = "bomb";

    const remainingPool = [...Array(GRID_SIZE).keys()].filter((index) => index !== bombedSelectedIndex);
    const extraBombIndices = pickRandomIndices(remainingPool, BOMB_COUNT - 1);

    for (const index of extraBombIndices) {
        tiles[index] = "bomb";
    }

    return tiles;
}

function buildLoseTilesJokeAll(): TileState[] {
    return Array(GRID_SIZE).fill("bomb");
}

function buildLoseTilesJokeChosen(selected: number[]): TileState[] {
    const tiles: TileState[] = Array(GRID_SIZE).fill("safe");

    for (const index of selected) {
        tiles[index] = "bomb";
    }

    return tiles;
}

function buildRevealedTiles(selected: number[], won: boolean): TileState[] {
    if (won) return buildWinTiles(selected);

    const shouldJoke = Math.random() < JOKE_CHANCE;
    if (!shouldJoke) return buildLoseTilesNormal(selected);

    const useJokeAll = Math.random() < 0.5;
    if (useJokeAll) return buildLoseTilesJokeAll();

    return buildLoseTilesJokeChosen(selected);
}

function buildRevealSchedule(selected: number[]): { index: number; delay: number }[] {
    const otherIndices = [...Array(GRID_SIZE).keys()].filter((index) => !selected.includes(index));
    const schedule: { index: number; delay: number }[] = [];

    selected.forEach((index, step) => {
        schedule.push({ index, delay: step * SELECTED_REVEAL_STAGGER });
    });

    const selectedSpan = (selected.length - 1) * SELECTED_REVEAL_STAGGER;
    const cascadeStart = selectedSpan + POST_SELECTED_PAUSE;

    otherIndices.forEach((index, step) => {
        schedule.push({ index, delay: cascadeStart + step * OTHER_TILE_STAGGER });
    });

    return schedule;
}

function getFaceSrc(state: TileState): string {
    if (state === "safe") return "/assets/svgs/tile-safe.svg";
    if (state === "bomb") return "/assets/svgs/tile-bomb.svg";

    return "/assets/svgs/tile-idk.svg";
}

function resolveHint(canSelect: boolean, canReveal: boolean, selectedCount: number, revealed: boolean): string {
    if (revealed) return "";
    if (canReveal) return "Press reveal to start";
    if (canSelect) return `Select ${MAX_SELECTIONS - selectedCount} more tile${MAX_SELECTIONS - selectedCount === 1 ? "" : "s"}`;

    return "";
}

// --- MinesweeperTile ---

interface TileProps {
    state: TileState;
    index: number;
    selectable: boolean;
    isSelected: boolean;
    onToggle: (index: number) => void;
    wrapperRef: React.RefObject<HTMLDivElement | null>;
}

function MinesweeperTile({ state, index, selectable, isSelected, onToggle, wrapperRef }: TileProps) {
    const faceStyle = {
        width: "100%",
        height: "100%",
        position: "absolute" as const,
        top: 0,
        left: 0,
        backfaceVisibility: "hidden" as const,
        WebkitBackfaceVisibility: "hidden" as const,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    return (
        <Paper
            elevation={0}
            onClick={() => selectable && onToggle(index)}
            sx={{
                width: 56,
                height: 56,
                bgcolor: "transparent",
                cursor: selectable ? "pointer" : "default",
                transition: "transform 0.2s ease",
                perspective: "600px",
                borderRadius: 2,
                position: "relative",
                transform: isSelected ? "translateY(-6px)" : undefined,
                "&:hover": selectable && !isSelected ? {
                    transform: "scale(1.06)",
                } : {},
            }}
        >
            <Box
                ref={wrapperRef}
                sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                }}
            >
                <Box sx={faceStyle}>
                    <Box
                        component="img"
                        src="/assets/svgs/tile-idk.svg"
                        alt="tile back"
                        sx={{ width: "100%", height: "100%" }}
                    />
                </Box>
                <Box
                    sx={{
                        ...faceStyle,
                        transform: "rotateY(180deg)",
                    }}
                >
                    <Box
                        component="img"
                        src={getFaceSrc(state)}
                        alt={state}
                        sx={{ width: "100%", height: "100%" }}
                    />
                </Box>
            </Box>
            {isSelected ? (
                <Box
                    component="svg"
                    viewBox="0 0 24 24"
                    sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        width: 30,
                        height: 30,
                        color: "secondary.main",
                        pointerEvents: "none",
                        filter: "drop-shadow(0 0 1.5px rgba(0,0,0,0.8)) drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
                    }}
                >
                    <path d="M5 21V4h9l.4 2H20v10h-7l-.4-2H7v7z" fill="currentColor" />
                </Box>
            ) : null}
        </Paper>
    );
}

// --- MinesweeperGameBox ---

interface GameBoxProps {
    handlePlay: () => Promise<void>;
    handleFinish: () => void;
    result: GameResult | null;
    isLocked: boolean;
    amountValid: boolean;
}

export default function MinesweeperGameBox({ handlePlay, handleFinish, result, isLocked, amountValid }: GameBoxProps) {
    const selectedRef = useRef<number[]>([]);
    const tileRefs = useRef([...Array(GRID_SIZE).keys()].map(() => ({ current: null as HTMLDivElement | null })));

    const [tiles, setTiles] = useState<TileState[]>(Array(GRID_SIZE).fill("hidden"));
    const [selected, setSelected] = useState<number[]>([]);
    const [animating, setAnimating] = useState(false);
    const [revealed, setRevealed] = useState(false);

    const canSelect = !isLocked && amountValid && !revealed && !animating;
    const canReveal = canSelect && selected.length === MAX_SELECTIONS;
    const statusHint = resolveHint(canSelect, canReveal, selected.length, revealed);

    useEffect(() => {
        tileRefs.current.forEach((ref) => {
            if (!ref.current) return;
            utils.set(ref.current, { rotateY: 0 });
        });
    }, []);

    useEffect(() => {
        if (result === null || selectedRef.current.length === 0 || revealed) return;

        const revealedTiles = buildRevealedTiles(selectedRef.current, result.won);

        setAnimating(true);
        animateReveal(selectedRef.current, revealedTiles);
    }, [result]);

    function handleTileToggle(index: number) {
        if (!canSelect) return;

        setSelected((previous) => {
            if (previous.includes(index)) {
                const next = previous.filter((value) => value !== index);
                selectedRef.current = next;
                return next;
            }

            if (previous.length < MAX_SELECTIONS) {
                const next = [...previous, index];
                selectedRef.current = next;
                return next;
            }

            const next = [...previous.slice(1), index];
            selectedRef.current = next;
            return next;
        });

        playSfx("shared/click");
    }

    async function handleReveal() {
        if (!canReveal) return;

        await handlePlay();
    }

    function flipTile(index: number, state: TileState) {
        const tileRef = tileRefs.current[index]?.current;
        if (!tileRef) return;

        setTiles((previous) => {
            const next = [...previous];
            next[index] = state;
            return next;
        });

        animate(tileRef, {
            rotateY: 180,
            duration: FLIP_DURATION,
            ease: FLIP_EASE,
        });
    }

    function animateReveal(selectedIndices: number[], revealedTiles: TileState[]) {
        const schedule = buildRevealSchedule(selectedIndices);

        schedule.forEach(({ index, delay }, step) => {
            setTimeout(() => {
                flipTile(index, revealedTiles[index]);
                playSfx("shared/click");

                if (step === schedule.length - 1) {
                    setTimeout(() => {
                        setAnimating(false);
                        setRevealed(true);
                        handleFinish();
                    }, SETTLE_DELAY);
                }
            }, delay);
        });
    }

    function handlePlayAgain() {
        tileRefs.current.forEach((ref) => {
            if (!ref.current) return;

            animate(ref.current, {
                rotateY: 0,
                duration: FLIP_DURATION,
                ease: FLIP_EASE,
            });
        });

        playSfx("shared/click");

        setTimeout(() => {
            setTiles(Array(GRID_SIZE).fill("hidden"));
            setSelected([]);
            selectedRef.current = [];
            setRevealed(false);
        }, FLIP_DURATION / 2);
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginY: 4 }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 1.5,
                }}
            >
                {tiles.map((state, index) => (
                    <MinesweeperTile
                        key={index}
                        state={state}
                        index={index}
                        selectable={canSelect}
                        isSelected={selected.includes(index)}
                        onToggle={handleTileToggle}
                        wrapperRef={tileRefs.current[index]}
                    />
                ))}
            </Box>

            <Box sx={{ minHeight: 36, display: "flex", alignItems: "center" }}>
                {revealed ? (
                    <Button variant="contained" onClick={handlePlayAgain}>
                        Play Again
                    </Button>
                ) : canReveal ? (
                    <Button variant="contained" onClick={handleReveal}>
                        Reveal
                    </Button>
                ) : (
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                        {statusHint}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}