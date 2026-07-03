"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { animate, utils, cubicBezier, random } from "animejs";
import { playSfx } from "@/lib/client/sfx";
import type { GameResult } from "@/types/api";

// --- Types ---

type CubeColor = "error" | "warning" | "secondary" | "tertiary" | "info" | "primary";

type FaceName = "front" | "back" | "left" | "right" | "top" | "bottom";

// --- Constants ---

const COLORS: CubeColor[] = ["error", "warning", "secondary", "tertiary", "info", "primary"];

const FACE_ORDER: FaceName[] = ["front", "back", "right", "left", "top", "bottom"];

const FACE_TRANSFORMS: Record<FaceName, string> = {
    front: "rotateY(0deg) translateZ(40px)",
    back: "rotateY(180deg) translateZ(40px)",
    right: "rotateY(90deg) translateZ(40px)",
    left: "rotateY(-90deg) translateZ(40px)",
    top: "rotateX(90deg) translateZ(40px)",
    bottom: "rotateX(-90deg) translateZ(40px)",
};

const FACE_LANDING_ROTATION: Record<FaceName, { x: number; y: number }> = {
    front: { x: 0, y: 0 },
    back: { x: 0, y: 180 },
    right: { x: 0, y: -90 },
    left: { x: 0, y: 90 },
    top: { x: -90, y: 0 },
    bottom: { x: 90, y: 0 },
};

const ROLL_EXTRA_SPINS_MIN = 3;
const ROLL_EXTRA_SPINS_MAX = 6;
const ROLL_DURATION_MIN = 1400;
const ROLL_DURATION_MAX = 2200;
const DIE_STAGGER = 150;
const SETTLE_DELAY = 300;
const ROLL_EASE = cubicBezier(0.22, 0.61, 0.36, 1);
const TILT_MIN = 15;
const TILT_MAX = 95;

// --- Helpers ---

function normalizeAngle(value: number): number {
    return ((value % 360) + 360) % 360;
}

function buildDiceFaces(chosenColor: CubeColor, won: boolean): [FaceName, FaceName] {
    const chosenFaceIndex = COLORS.indexOf(chosenColor);
    const chosenFace = FACE_ORDER[chosenFaceIndex];

    const otherFaces = FACE_ORDER.filter((face) => face !== chosenFace);

    function randomOtherFace(): FaceName {
        return otherFaces[Math.floor(Math.random() * otherFaces.length)];
    }

    if (won) {
        const winningDieIndex = Math.random() < 0.5 ? 0 : 1;

        const faces: [FaceName, FaceName] = ["front", "front"];
        faces[winningDieIndex] = chosenFace;
        faces[1 - winningDieIndex] = randomOtherFace();

        return faces;
    }

    return [randomOtherFace(), randomOtherFace()];
}

function getFaceBackground(color: CubeColor): string {
    return `${color}.main`;
}

// --- ColorChoices ---

interface ChoicesProps {
    canPlay: boolean;
    onChoice: (color: CubeColor) => void;
    selectedColor: CubeColor | null;
}

function getChoiceBorderColor(color: CubeColor, selectedColor: CubeColor | null, canPlay: boolean): string {
    const isSelected = selectedColor === color;

    if (isSelected) return "secondary.main";
    if (canPlay) return "#ffffff";

    return "transparent";
}

function ColorChoices({ canPlay, onChoice, selectedColor }: ChoicesProps) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(2, 1fr)",
                gap: 1.5,
                justifyContent: "center",
            }}
        >
            {COLORS.map((color) => {
                const borderColor = getChoiceBorderColor(color, selectedColor, canPlay);
                const isSelectable = canPlay;

                return (
                    <Paper
                        key={color}
                        elevation={0}
                        onClick={() => isSelectable && onChoice(color)}
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: `${color}.main`,
                            cursor: isSelectable ? "pointer" : "default",
                            border: "2px solid",
                            borderColor,
                            transition: "transform 0.15s ease, border-color 0.2s ease",
                            "&:hover": isSelectable ? { transform: "scale(1.08)" } : {},
                        }}
                    />
                );
            })}
        </Box>
    );
}

// --- ColorCubeDie ---

interface DieProps {
    wrapperRef: React.RefObject<HTMLDivElement | null>;
    outerRef: React.RefObject<HTMLDivElement | null>;
}

function ColorCubeDie({ wrapperRef, outerRef }: DieProps) {
    const faceStyle = {
        width: "100%",
        height: "100%",
        position: "absolute" as const,
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
        backfaceVisibility: "hidden" as const,
        WebkitBackfaceVisibility: "hidden" as const,
    };

    return (
        <Box ref={outerRef} sx={{ display: "inline-flex" }}>
            <Box sx={{ perspective: "700px" }}>
                <Box
                    ref={wrapperRef}
                    sx={{
                        width: 80,
                        height: 80,
                        position: "relative",
                        transformStyle: "preserve-3d",
                    }}
                >
                    {FACE_ORDER.map((face, index) => (
                        <Box
                            key={face}
                            sx={{
                                ...faceStyle,
                                bgcolor: getFaceBackground(COLORS[index]),
                                transform: FACE_TRANSFORMS[face],
                            }}
                        >
                            <Box
                                component="svg"
                                viewBox="0 0 24 24"
                                sx={{ width: "100%", height: "100%", color: "rgba(0,0,0,0.75)" }}
                            >
                                <g transform="translate(2,2) scale(0.83)">
                                    <path
                                        fill="currentColor"
                                        d="M5.998 3a7 7 0 0 1 6.913 5.895A6.48 6.48 0 0 1 17.498 7h4.5v2.5a6.5 6.5 0 0 1-6.5 6.5h-2.5v5h-2v-8h-2a7 7 0 0 1-7-7V3zm14 6h-2.5a4.5 4.5 0 0 0-4.5 4.5v.5h2.5a4.5 4.5 0 0 0 4.5-4.5zm-14-4h-2v1a5 5 0 0 0 5 5h2v-1a5 5 0 0 0-5-5"
                                    />
                                </g>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

// --- ColorsGameBox ---

interface GameBoxProps {
    handlePlay: () => Promise<void>;
    handleFinish: () => void;
    result: GameResult | null;
    isLocked: boolean;
    amountValid: boolean;
}

export default function ColorsGameBox({ handlePlay, handleFinish, result, isLocked, amountValid }: GameBoxProps) {
    const dieRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
    const outerRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
    const rotationRefs = [useRef({ x: 0, y: 0 }), useRef({ x: 0, y: 0 })];
    const tiltRefs = [useRef(0), useRef(0)];
    const selectedColorRef = useRef<CubeColor | null>(null);

    const [selectedColor, setSelectedColor] = useState<CubeColor | null>(null);
    const [rolling, setRolling] = useState(false);
    const [revealed, setRevealed] = useState(false);

    const canPlay = !isLocked && amountValid && !rolling;
    const hasPlayed = result !== null;
    const statusHint = resolveHint(canPlay, hasPlayed);

    useEffect(() => {
        dieRefs.forEach((ref) => {
            if (!ref.current) return;
            utils.set(ref.current, { rotateX: 0, rotateY: 0 });
        });
        outerRefs.forEach((ref) => {
            if (!ref.current) return;
            utils.set(ref.current, { rotate: 0 });
        });
    }, []);

    useEffect(() => {
        if (result === null || selectedColorRef.current === null || revealed) return;

        const chosenColor = selectedColorRef.current;
        const faces = buildDiceFaces(chosenColor, result.won);

        setRolling(true);
        rollDice(faces);
    }, [result]);

    function resolveHint(canPlay: boolean, hasPlayed: boolean): string {
        if (!canPlay) return "";
        if (hasPlayed) return "Choose again to start";

        return "Pick a color to start";
    }

    async function handleChoice(color: CubeColor) {
        if (!canPlay) return;

        selectedColorRef.current = color;
        setSelectedColor(color);
        setRevealed(false);

        await handlePlay();
    }

    function rollDie(index: number, landingFace: FaceName, duration: number) {
        const dieRef = dieRefs[index].current;
        const outerRef = outerRefs[index].current;
        if (!dieRef || !outerRef) return;

        const current = rotationRefs[index].current;
        const currentXMod = normalizeAngle(current.x);
        const currentYMod = normalizeAngle(current.y);

        const landing = FACE_LANDING_ROTATION[landingFace];
        const landingXMod = normalizeAngle(landing.x);
        const landingYMod = normalizeAngle(landing.y);

        let deltaX = landingXMod - currentXMod;
        if (deltaX <= 0) deltaX += 360;

        let deltaY = landingYMod - currentYMod;
        if (deltaY <= 0) deltaY += 360;

        const extraSpins = random(ROLL_EXTRA_SPINS_MIN, ROLL_EXTRA_SPINS_MAX) * 360;

        const targetX = current.x + extraSpins + deltaX;
        const targetY = current.y + extraSpins + deltaY;

        rotationRefs[index].current = { x: targetX, y: targetY };

        let lastQuarterTurn = Math.floor(current.x / 90) + Math.floor(current.y / 90);

        animate(dieRef, {
            rotateX: targetX,
            rotateY: targetY,
            duration,
            ease: ROLL_EASE,
            onUpdate: (self) => {
                if (!dieRef || self.progress >= 1) return;
                const liveX = utils.get(dieRef, "rotateX", false) as number;
                const liveY = utils.get(dieRef, "rotateY", false) as number;
                const currentQuarterTurn = Math.floor(liveX / 90) + Math.floor(liveY / 90);
                const crossedBoundary = currentQuarterTurn !== lastQuarterTurn;
                if (crossedBoundary) {
                    lastQuarterTurn = currentQuarterTurn;
                    playSfx("shared/click");
                }
            },
        });

        const tiltDirection = Math.random() < 0.5 ? -1 : 1;
        const tiltAmount = random(TILT_MIN, TILT_MAX);
        const targetTilt = tiltRefs[index].current + tiltDirection * tiltAmount;

        tiltRefs[index].current = targetTilt;

        animate(outerRef, {
            rotate: targetTilt,
            duration,
            ease: ROLL_EASE,
        });
    }

    function rollDice(faces: [FaceName, FaceName]) {
        const firstDuration = random(ROLL_DURATION_MIN, ROLL_DURATION_MAX);
        const secondDuration = random(ROLL_DURATION_MIN, ROLL_DURATION_MAX);

        rollDie(0, faces[0], firstDuration);

        setTimeout(() => {
            rollDie(1, faces[1], secondDuration);
        }, DIE_STAGGER);

        const longestFinishTime = Math.max(firstDuration, DIE_STAGGER + secondDuration);

        setTimeout(() => {
            setRolling(false);
            setRevealed(true);
            handleFinish();
        }, longestFinishTime + SETTLE_DELAY);
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginY: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <Box sx={{ display: "flex", gap: 6 }}>
                    <ColorCubeDie wrapperRef={dieRefs[0]} outerRef={outerRefs[0]} />
                    <ColorCubeDie wrapperRef={dieRefs[1]} outerRef={outerRefs[1]} />
                </Box>

                <ColorChoices
                    canPlay={canPlay}
                    onChoice={handleChoice}
                    selectedColor={selectedColor}
                />
            </Box>

            <Box sx={{ minHeight: 24, display: "flex", alignItems: "center" }}>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {statusHint}
                </Typography>
            </Box>
        </Box>
    );
}