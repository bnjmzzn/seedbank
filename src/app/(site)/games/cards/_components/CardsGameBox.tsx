"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { animate, utils, cubicBezier } from "animejs";
import { playSfx } from "@/lib/client/sfx";
import type { GameResult } from "@/types/api";

// --- Types ---

type CardState = "hidden" | "safe" | "bomb";

// --- Constants ---

const CARD_COUNT = 3;
const CHOSEN_REVEAL_DELAY = 200;
const POST_CHOSEN_PAUSE = 700;
const OTHER_CARD_STAGGER = 350;
const SETTLE_DELAY = 400;
const FLIP_DURATION = 500;
const FLIP_EASE = cubicBezier(0.45, 0.05, 0.55, 0.95);

// --- Helpers ---

function buildRevealedCards(chosenIndex: number, won: boolean): CardState[] {
    const cards: CardState[] = Array(CARD_COUNT).fill("hidden");
    cards[chosenIndex] = won ? "safe" : "bomb";

    const otherIndices = [...Array(CARD_COUNT).keys()].filter((index) => index !== chosenIndex);

    for (const index of otherIndices) {
        cards[index] = Math.random() < 0.5 ? "safe" : "bomb";
    }

    const allSame = cards.every((state) => state === cards[0]);
    if (allSame) {
        const flipIndex = otherIndices[0];
        cards[flipIndex] = cards[flipIndex] === "safe" ? "bomb" : "safe";
    }

    return cards;
}

function buildRevealSchedule(chosenIndex: number): { index: number; delay: number }[] {
    const otherIndices = [...Array(CARD_COUNT).keys()].filter((index) => index !== chosenIndex);

    const schedule = [{ index: chosenIndex, delay: CHOSEN_REVEAL_DELAY }];

    otherIndices.forEach((index, step) => {
        schedule.push({
            index,
            delay: CHOSEN_REVEAL_DELAY + POST_CHOSEN_PAUSE + step * OTHER_CARD_STAGGER,
        });
    });

    return schedule;
}

function getFaceSrc(state: CardState): string {
    if (state === "safe") return "/assets/svgs/card-safe.svg";
    if (state === "bomb") return "/assets/svgs/card-bomb.svg";

    return "/assets/svgs/card-idk.svg";
}

// --- CardsCard ---

interface CardProps {
    state: CardState;
    index: number;
    selectable: boolean;
    isChosen: boolean;
    onFlip: (index: number) => void;
    wrapperRef: React.RefObject<HTMLDivElement | null>;
}

function CardsCard({ state, index, selectable, isChosen, onFlip, wrapperRef }: CardProps) {
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
            onClick={() => selectable && onFlip(index)}
            sx={{
                width: 90,
                height: 130,
                bgcolor: "transparent",
                cursor: selectable ? "pointer" : "default",
                transition: "transform 0.2s ease",
                perspective: "600px",
                transform: isChosen ? "translateY(-15px)" : undefined,
                "&:hover": selectable && !isChosen ? {
                    transform: "scale(1.04)",
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
                        src="/assets/svgs/card-idk.svg"
                        alt="card back"
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
        </Paper>
    );
}

// --- CardsGameBox ---

interface GameBoxProps {
    handlePlay: () => Promise<void>;
    handleFinish: () => void;
    result: GameResult | null;
    isLocked: boolean;
    amountValid: boolean;
}

export default function CardsGameBox({ handlePlay, handleFinish, result, isLocked, amountValid }: GameBoxProps) {
    const chosenIndexRef = useRef<number | null>(null);
    const cardRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

    const [cards, setCards] = useState<CardState[]>(Array(CARD_COUNT).fill("hidden"));
    const [chosenIndex, setChosenIndex] = useState<number | null>(null);
    const [animating, setAnimating] = useState(false);
    const [revealed, setRevealed] = useState(false);

    const canPlay = !isLocked && amountValid && !revealed && !animating;
    const statusHint = resolveHint(canPlay, revealed);

    useEffect(() => {
        cardRefs.forEach((ref) => {
            if (!ref.current) return;
            utils.set(ref.current, { rotateY: 0 });
        });
    }, []);

    useEffect(() => {
        if (result === null || chosenIndexRef.current === null || revealed) return;

        const chosen = chosenIndexRef.current;
        const revealedCards = buildRevealedCards(chosen, result.won);

        setAnimating(true);
        animateReveal(chosen, revealedCards);
    }, [result]);

    function resolveHint(canPlay: boolean, revealed: boolean): string {
        if (revealed) return "";
        if (!canPlay) return "";

        return "Pick a card to start";
    }

    async function handleCardFlip(index: number) {
        if (!canPlay) return;

        chosenIndexRef.current = index;
        setChosenIndex(index);

        await handlePlay();
    }

    function flipCard(index: number, state: CardState) {
        const cardRef = cardRefs[index].current;
        if (!cardRef) return;

        setCards((previous) => {
            const next = [...previous];
            next[index] = state;
            return next;
        });

        animate(cardRef, {
            rotateY: 180,
            duration: FLIP_DURATION,
            ease: FLIP_EASE,
        });

        playSfx("shared/click");
    }

    function animateReveal(chosenIndex: number, revealedCards: CardState[]) {
        const schedule = buildRevealSchedule(chosenIndex);

        schedule.forEach(({ index, delay }, step) => {
            setTimeout(() => {
                flipCard(index, revealedCards[index]);

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
        cardRefs.forEach((ref) => {
            if (!ref.current) return;

            animate(ref.current, {
                rotateY: 0,
                duration: FLIP_DURATION,
                ease: FLIP_EASE,
            });
        });

        playSfx("shared/click");

        setTimeout(() => {
            setCards(Array(CARD_COUNT).fill("hidden"));
            setChosenIndex(null);
            chosenIndexRef.current = null;
            setRevealed(false);
        }, FLIP_DURATION / 2);
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginY: 4 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
                {cards.map((state, index) => (
                    <CardsCard
                        key={index}
                        state={state}
                        index={index}
                        selectable={canPlay}
                        isChosen={index === chosenIndex}
                        onFlip={handleCardFlip}
                        wrapperRef={cardRefs[index]}
                    />
                ))}
            </Box>

            <Box sx={{ minHeight: 36, display: "flex", alignItems: "center" }}>
                {revealed ? (
                    <Button variant="contained" onClick={handlePlayAgain}>
                        Play Again
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