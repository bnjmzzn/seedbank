"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { animate, cubicBezier } from "animejs";
import { playSfx } from "@/lib/client/sfx";
import type { GameResult } from "@/types/api";

// --- Types ---

type SlotSymbol = "bomb" | "safe" | "star" | "idk";

interface ReelItem {
    id: number;
    symbol: SlotSymbol;
}

// --- Constants ---

const SYMBOLS: SlotSymbol[] = ["bomb", "safe", "star", "idk"];

const CHOICES: { value: SlotSymbol; label: string }[] = [
    { value: "bomb", label: "Bomb" },
    { value: "safe", label: "Safe" },
    { value: "star", label: "Star" },
    { value: "idk", label: "Idk" },
];

const SYMBOL_ICONS: Record<SlotSymbol, string> = {
    bomb: "/assets/svgs/tile-bomb.svg",
    safe: "/assets/svgs/tile-safe.svg",
    star: "/assets/svgs/tile-star.svg",
    idk: "/assets/svgs/tile-idk.svg",
};

const REEL_COUNT = 4;
const REEL_LENGTH = 60;
const ITEM_HEIGHT = 88;
const REEL_BASE_DURATION = 1800;
const REEL_STAGGER_DELAY = 1000;
const SPIN_EASE = cubicBezier(0.25, 0.1, 0.1, 1);

// --- Helpers ---

function getOtherSymbol(exclude: SlotSymbol): SlotSymbol {
    const pool = SYMBOLS.filter((symbol) => symbol !== exclude);
    return pool[Math.floor(Math.random() * pool.length)];
}

function buildReel(landingSymbol: SlotSymbol, landingIndex: number): ReelItem[] {
    return Array.from({ length: REEL_LENGTH }, (_, index) => {
        if (index === landingIndex) return { id: index, symbol: landingSymbol };
        return { id: index, symbol: getOtherSymbol(landingSymbol) };
    });
}

function resolveMatchCount(won: boolean): number {
    if (won) {
        const roll = Math.random();
        return roll < 0.7 ? 2 : 3;
    }

    const roll = Math.random();
    return roll < 0.6 ? 0 : 1;
}

function buildMatchPattern(matchCount: number): boolean[] {
    const positions = [0, 1, 2, 3];

    for (let i = positions.length - 1; i > 0; i -= 1) {
        const swapIndex = Math.floor(Math.random() * (i + 1));
        const temp = positions[i];
        positions[i] = positions[swapIndex];
        positions[swapIndex] = temp;
    }

    const matchedPositions = positions.slice(0, matchCount);

    return Array.from({ length: REEL_COUNT }, (_, index) => matchedPositions.includes(index));
}

function getChoiceBorderColor(
    value: SlotSymbol,
    selectedChoice: SlotSymbol | null,
    canPlay: boolean,
): string {
    const isSelected = selectedChoice === value;

    if (isSelected) return "secondary.main";
    if (canPlay) return "rgba(255,255,255,0.25)";

    return "transparent";
}

// --- SlotsChoices ---

interface ChoicesProps {
    canPlay: boolean;
    onChoice: (value: SlotSymbol) => void;
    selectedChoice: SlotSymbol | null;
}

function SlotsChoices({ canPlay, onChoice, selectedChoice }: ChoicesProps) {
    return (
        <Box sx={{ display: "flex", gap: 2 }}>
            {CHOICES.map((choice) => {
                const borderColor = getChoiceBorderColor(choice.value, selectedChoice, canPlay);
                const isSelectable = canPlay;

                return (
                    <Paper
                        key={choice.value}
                        elevation={0}
                        onClick={() => isSelectable && onChoice(choice.value)}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                            p: 2,
                            borderRadius: 2,
                            border: "2px solid",
                            borderColor,
                            cursor: isSelectable ? "pointer" : "default",
                            transition: "border-color 0.3s, transform 0.15s ease",
                            bgcolor: "grey.900",
                            "&:hover": isSelectable ? { bgcolor: "grey.800", transform: "scale(1.04)" } : {},
                        }}
                    >
                        <Box
                            component="img"
                            src={SYMBOL_ICONS[choice.value]}
                            alt={choice.label}
                            sx={{ width: 56, height: 56 }}
                        />
                        <Typography variant="body2">{choice.label}</Typography>
                    </Paper>
                );
            })}
        </Box>
    );
}

// --- SlotsLastPick ---

interface LastPickProps {
    lastChoice: SlotSymbol | null;
}

function SlotsLastPick({ lastChoice }: LastPickProps) {
    const hasLastChoice = lastChoice !== null;

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 28 }}>
            {hasLastChoice && (
                <>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Chosen:
                    </Typography>
                    <Box
                        component="img"
                        src={SYMBOL_ICONS[lastChoice]}
                        alt={lastChoice}
                        sx={{ width: 28, height: 28 }}
                    />
                </>
            )}
        </Box>
    );
}

// --- SlotsReel ---

interface ReelProps {
    reel: ReelItem[];
    reelRef: React.RefObject<HTMLDivElement | null>;
}

function SlotsReel({ reel, reelRef }: ReelProps) {
    return (
        <Box
            sx={{
                width: ITEM_HEIGHT,
                height: ITEM_HEIGHT,
                overflow: "hidden",
                position: "relative",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
            }}
        >
            <Box ref={reelRef} sx={{ display: "flex", flexDirection: "column", willChange: "transform" }}>
                {reel.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            width: ITEM_HEIGHT,
                            height: ITEM_HEIGHT,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.900",
                        }}
                    >
                        <Box
                            component="img"
                            src={SYMBOL_ICONS[item.symbol]}
                            alt={item.symbol}
                            sx={{ width: 56, height: 56 }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

// --- SlotsGameBox ---

interface GameBoxProps {
    handlePlay: () => Promise<void>;
    handleFinish: () => void;
    result: GameResult | null;
    isLocked: boolean;
    amountValid: boolean;
}

export default function SlotsGameBox({ handlePlay, handleFinish, result, isLocked, amountValid }: GameBoxProps) {
    const reelRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
    ];
    const positionRefs = useRef([{ y: 0 }, { y: 0 }, { y: 0 }, { y: 0 }]);
    const selectedChoiceRef = useRef<SlotSymbol | null>(null);
    const finishedReelsRef = useRef(0);

    const [selectedChoice, setSelectedChoice] = useState<SlotSymbol | null>(null);
    const [lastChoice, setLastChoice] = useState<SlotSymbol | null>(null);
    const [reels, setReels] = useState<ReelItem[][]>(() =>
        Array.from({ length: REEL_COUNT }, () => buildReel(getOtherSymbol("idk"), 0)),
    );

    const canPlay = !isLocked && amountValid;

    useEffect(() => {
        if (result === null || selectedChoiceRef.current === null) return;

        const choice = selectedChoiceRef.current;
        const matchPattern = buildMatchPattern(resolveMatchCount(result.won));

        spinReels(choice, matchPattern);
    }, [result]);

    async function handleChoice(value: SlotSymbol) {
        if (!canPlay) return;

        selectedChoiceRef.current = value;
        setSelectedChoice(value);
        setLastChoice(value);

        await handlePlay();
    }

    function applyTransform(reelIndex: number) {
        const reelEl = reelRefs[reelIndex].current;
        if (!reelEl) return;

        const offset = positionRefs.current[reelIndex].y;
        reelEl.style.transform = `translateY(-${offset}px)`;
    }

    function spinReels(choice: SlotSymbol, matchPattern: boolean[]) {
        finishedReelsRef.current = 0;

        const landingIndex = REEL_LENGTH - 5;

        const nextReels = matchPattern.map((shouldMatch) => {
            const landingSymbol = shouldMatch ? choice : getOtherSymbol(choice);
            return buildReel(landingSymbol, landingIndex);
        });

        setReels(nextReels);

        nextReels.forEach((reel, reelIndex) => {
            const reelEl = reelRefs[reelIndex].current;
            if (!reelEl) return;

            positionRefs.current[reelIndex].y = 0;
            applyTransform(reelIndex);

            const finalOffset = landingIndex * ITEM_HEIGHT;
            const duration = REEL_BASE_DURATION + reelIndex * REEL_STAGGER_DELAY;

            let lastItemIndex = 0;

            animate(positionRefs.current[reelIndex], {
                y: finalOffset,
                duration,
                ease: SPIN_EASE,
                onUpdate: () => {
                    applyTransform(reelIndex);

                    const liveItemIndex = Math.round(positionRefs.current[reelIndex].y / ITEM_HEIGHT);
                    const crossedItem = liveItemIndex !== lastItemIndex;

                    if (crossedItem) {
                        lastItemIndex = liveItemIndex;
                        playSfx("shared/click");
                    }
                },
                onComplete: () => {
                    finishedReelsRef.current += 1;

                    const allReelsFinished = finishedReelsRef.current === REEL_COUNT;
                    if (!allReelsFinished) return;

                    setTimeout(() => {
                        setSelectedChoice(null);
                        selectedChoiceRef.current = null;
                        handleFinish();
                    }, 300);
                },
            });
        });
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <SlotsLastPick lastChoice={lastChoice} />
            <Box sx={{ display: "flex", gap: 1.5 }}>
                {reels.map((reel, index) => (
                    <SlotsReel key={index} reel={reel} reelRef={reelRefs[index]} />
                ))}
            </Box>
            <SlotsChoices canPlay={canPlay} onChoice={handleChoice} selectedChoice={selectedChoice} />
        </Box>
    );
}