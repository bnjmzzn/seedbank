"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { animate, utils, cubicBezier, random } from "animejs";
import { playSfx } from "@/lib/client/sfx";
import { ApiResult } from "../page";

// --- Types ---

type CoinFace = "heads" | "tails";

// --- Constants ---

const CHOICES: { value: CoinFace; label: string }[] = [
    { value: "heads", label: "Heads" },
    { value: "tails", label: "Tails" },
];

const SPIN_EXTRA_ROTATIONS_MIN = 6;
const SPIN_EXTRA_ROTATIONS_MAX = 10;
const SPIN_DURATION_MIN = 2000;
const SPIN_DURATION_MAX = 4000;
const SETTLE_DELAY = 300;
const SPIN_EASE = cubicBezier(0.004, 0.509,0.255,0.965);

// --- Helpers ---

function getOtherFace(face: CoinFace): CoinFace {
    return face === "heads" ? "tails" : "heads";
}

function getChoiceBorderColor(
    value: CoinFace,
    selectedChoice: CoinFace | null,
    won: boolean | null,
    canPlay: boolean,
): string {
    const isSelected = selectedChoice === value;

    if (isSelected) return "secondary.main";
    if (canPlay) return "rgba(255,255,255,0.25)";

    return "transparent";
}

// --- CoinflipGame ---

interface GameProps {
    canPlay: boolean;
    onChoice: (value: CoinFace) => void;
    selectedChoice: CoinFace | null;
    won: boolean | null;
}

function CoinflipGame({ canPlay, onChoice, selectedChoice, won }: GameProps) {
    return (
        <Box sx={{ display: "flex", gap: 2 }}>
            {CHOICES.map((choice) => {
                const borderColor = getChoiceBorderColor(choice.value, selectedChoice, won, canPlay);
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
                            transition: "border-color 0.3s",
                            bgcolor: "grey.900",
                            "&:hover": isSelectable ? { bgcolor: "grey.800" } : {},
                        }}
                    >
                        <Box
                            component="img"
                            src={`/assets/svgs/coinflip-${choice.value}.svg`}
                            alt={choice.label}
                            sx={{ width: 72, height: 72 }}
                        />
                        <Typography variant="body2">{choice.label}</Typography>
                    </Paper>
                );
            })}
        </Box>
    );
}

// --- CoinflipCoin ---

interface CoinProps {
    wrapperRef: React.RefObject<HTMLDivElement | null>;
}

function CoinflipCoin({ wrapperRef }: CoinProps) {
    const faceStyle = {
        width: "100%",
        height: "100%",
        position: "absolute" as const,
        top: 0,
        left: 0,
        backfaceVisibility: "hidden" as const,
        WebkitBackfaceVisibility: "hidden" as const,
    };

    return (
        <Box sx={{ perspective: "600px" }}>
            <Box
                ref={wrapperRef}
                sx={{
                    width: 120,
                    height: 120,
                    position: "relative",
                    transformStyle: "preserve-3d",
                }}
            >
                <Box
                    component="img"
                    src="/assets/svgs/coinflip-heads.svg"
                    alt="heads"
                    style={faceStyle}
                />
                <Box
                    component="img"
                    src="/assets/svgs/coinflip-tails.svg"
                    alt="tails"
                    style={{
                        ...faceStyle,
                        transform: "rotateY(180deg)",
                    }}
                />
            </Box>
        </Box>
    );
}

// --- CoinflipVisualizer ---

interface VisualizerProps {
    handlePlay: () => Promise<void>;
    handleFinish: () => void;
    result: ApiResult | null;
    isLocked: boolean;
    amountValid: boolean;
}

export default function CoinflipVisualizer({ handlePlay, handleFinish, result, isLocked, amountValid }: VisualizerProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const currentRotationRef = useRef(0);
    const selectedChoiceRef = useRef<CoinFace | null>(null);

    const [selectedChoice, setSelectedChoice] = useState<CoinFace | null>(null);
    const [won, setWon] = useState<boolean | null>(null);

    const canPlay = !isLocked && amountValid;

    useEffect(() => {
        if (!wrapperRef.current) return;
        utils.set(wrapperRef.current, { rotateY: 0 });
    }, []);

    useEffect(() => {
        if (result === null || selectedChoiceRef.current === null) return;

        const choice = selectedChoiceRef.current;
        const resultWon = result.won;
        const landingFace = resultWon ? choice : getOtherFace(choice);

        setWon(resultWon);
        animateCoin(landingFace);
    }, [result]);

    async function handleChoice(value: CoinFace) {
        if (!canPlay) return;

        selectedChoiceRef.current = value;
        setSelectedChoice(value);
        setWon(null);

        await handlePlay();
    }

    function animateCoin(landingFace: CoinFace) {
        if (!wrapperRef.current) return;
    
        const current = currentRotationRef.current;
        const currentMod = ((current % 360) + 360) % 360;
    
        const faceTargetMod = landingFace === "heads" ? 0 : 180;
        const extraSpins = random(SPIN_EXTRA_ROTATIONS_MIN, SPIN_EXTRA_ROTATIONS_MAX) * 360;
        const duration = random(SPIN_DURATION_MIN, SPIN_DURATION_MAX);
    
        let delta = faceTargetMod - currentMod;
        if (delta <= 0) delta += 360;
    
        const targetRotation = current + extraSpins + delta;
        currentRotationRef.current = targetRotation;
    
        let lastHalfTurn = Math.floor(current / 180);
    
        animate(wrapperRef.current, {
            rotateY: targetRotation,
            duration,
            ease: SPIN_EASE,
            onUpdate: (self) => {
                if (!wrapperRef.current || self.progress >= 1) return;
                const liveRotation = utils.get(wrapperRef.current, "rotateY", false) as number;
                const currentHalfTurn = Math.floor(liveRotation / 180);
                const crossedBoundary = currentHalfTurn !== lastHalfTurn;
                if (crossedBoundary) {
                    lastHalfTurn = currentHalfTurn;
                    playSfx("shared/click");
                }
            },
            onComplete: () => {
                setTimeout(() => {
                    setSelectedChoice(null);
                    setWon(null);
                    selectedChoiceRef.current = null;
                    handleFinish();
                }, SETTLE_DELAY);
            },
        });
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <CoinflipCoin wrapperRef={wrapperRef} />
            <CoinflipGame
                canPlay={canPlay}
                onChoice={handleChoice}
                selectedChoice={selectedChoice}
                won={won}
            />
        </Box>
    );
}