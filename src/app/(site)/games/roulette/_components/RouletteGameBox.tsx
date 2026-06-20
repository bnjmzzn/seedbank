"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { animate, cubicBezier } from "animejs";
import { playSfx } from "@/lib/client/sfx";
import type { GameResult } from "@/types/api";

// --- Types ---

type SlotColor = "safe" | "bomb" | "star";

interface SlotItem {
    id: number;
    color: SlotColor;
}

// --- Constants ---

const ITEM_WIDTH = 88;
const ITEM_GAP = 10;
const ITEM_STRIDE = ITEM_WIDTH + ITEM_GAP;
const VISIBLE_ITEMS_DESKTOP = 5;
const VISIBLE_ITEMS_MOBILE = 3;
const TRACK_LENGTH = 200;
const SPIN_DURATION_MS = 4500;
const MIN_SPIN_ITEMS = 50;
const MAX_SPIN_ITEMS = 70;
const SPIN_EASE = cubicBezier(0.25, 0.1, 0.1, 1);
const RESET_DURATION_MS = 300;

const TILE_ICONS: Record<SlotColor, string> = {
    safe: "/assets/svgs/tile-safe.svg",
    bomb: "/assets/svgs/tile-bomb.svg",
    star: "/assets/svgs/tile-star.svg",
};

// --- Helpers ---

function buildTrack(): SlotItem[] {
    const starIndex = Math.floor(Math.random() * TRACK_LENGTH);

    return Array.from({ length: TRACK_LENGTH }, (_, index) => {
        if (index === starIndex) return { id: index, color: "star" };

        const isSafe = Math.random() < 0.5;
        return { id: index, color: isSafe ? "safe" : "bomb" };
    });
}

function findCandidates(track: SlotItem[], fromIndex: number, targetColor: "safe" | "bomb", visibleItems: number) {
    const safeEnd = TRACK_LENGTH - Math.ceil(visibleItems / 2) - 1;
    const start = fromIndex + MIN_SPIN_ITEMS;
    const end = Math.min(fromIndex + MAX_SPIN_ITEMS, safeEnd);

    return track
        .slice(start, end)
        .map((slot, relativeIndex) => ({ slot, absoluteIndex: start + relativeIndex }))
        .filter(({ slot }) => slot.color === targetColor);
}

function pickTargetOffset(absoluteIndex: number, centerOffset: number): number {
    const jitterRange = ITEM_WIDTH * 0.4;
    const jitter = Math.floor(Math.random() * jitterRange) - jitterRange / 2;

    return absoluteIndex * ITEM_STRIDE - centerOffset + ITEM_GAP + jitter;
}

// --- RouletteTrack ---

interface TrackProps {
    track: SlotItem[];
    trackRef: React.RefObject<HTMLDivElement | null>;
    viewportWidth: number;
}

function RouletteTrack({ track, trackRef, viewportWidth }: TrackProps) {
    return (
        <Box
            sx={{
                width: viewportWidth,
                maxWidth: "100%",
                overflow: "hidden",
                position: "relative",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    bottom: 0,
                    width: 2,
                    bgcolor: "secondary.main",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    pointerEvents: "none",
                }}
            />
            <Box
                ref={trackRef}
                sx={{
                    display: "flex",
                    gap: 1.25,
                    p: 1.5,
                    willChange: "transform",
                }}
            >
                {track.map((slot) => (
                    <Box
                        key={slot.id}
                        sx={{
                            minWidth: ITEM_WIDTH,
                            height: ITEM_WIDTH,
                            borderRadius: 2,
                            bgcolor: "grey.900",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            component="img"
                            src={TILE_ICONS[slot.color]}
                            alt={slot.color}
                            sx={{ width: 64, height: 64 }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

// --- RouletteGameBox ---

interface GameBoxProps {
    handlePlay: () => Promise<void>;
    handleFinish: () => void;
    result: GameResult | null;
    isLocked: boolean;
    amountValid: boolean;
}

export default function RouletteGameBox({ handlePlay, handleFinish, result, isLocked, amountValid }: GameBoxProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const trackRef = useRef<HTMLDivElement>(null);
    const trackDataRef = useRef<SlotItem[]>(buildTrack());
    const positionRef = useRef({ x: 0 });
    const currentItemRef = useRef(0);

    const [renderTrack, setRenderTrack] = useState<SlotItem[]>(trackDataRef.current);
    const [isSpinning, setIsSpinning] = useState(false);

    const visibleItems = isMobile ? VISIBLE_ITEMS_MOBILE : VISIBLE_ITEMS_DESKTOP;
    const centerOffset = Math.floor(visibleItems / 2) * ITEM_STRIDE;
    const viewportWidth = visibleItems * ITEM_STRIDE - ITEM_GAP;

    const canPlay = !isLocked && amountValid && !isSpinning;

    useEffect(() => {
        if (result === null || !trackRef.current) return;

        runSpin(result.won);
    }, [result]);

    async function handleSpinClick() {
        if (!canPlay) return;

        setIsSpinning(true);
        await handlePlay();
    }

    function applyTransform() {
        if (!trackRef.current) return;
        trackRef.current.style.transform = `translateX(-${positionRef.current.x}px)`;
    }

    function spinTo(targetOffset: number, onComplete: () => void) {
        if (!trackRef.current) return;

        const startItem = currentItemRef.current;
        let lastTileIndex = startItem;

        animate(positionRef.current, {
            x: targetOffset,
            duration: SPIN_DURATION_MS,
            ease: SPIN_EASE,
            onUpdate: () => {
                applyTransform();

                const liveTileIndex = Math.round((positionRef.current.x + centerOffset - ITEM_GAP) / ITEM_STRIDE);
                const crossedTile = liveTileIndex !== lastTileIndex;

                if (crossedTile) {
                    lastTileIndex = liveTileIndex;
                    playSfx("shared/click");
                }
            },
            onComplete,
        });
    }

    function resetTrack(onComplete: () => void) {
        if (!trackRef.current) return;

        animate(positionRef.current, {
            x: 0,
            duration: RESET_DURATION_MS,
            ease: "inOutQuad",
            onUpdate: applyTransform,
            onComplete,
        });
    }

    function runSpin(didWin: boolean) {
        const targetColor = didWin ? "safe" : "bomb";
        const safeEnd = TRACK_LENGTH - Math.ceil(visibleItems / 2) - 1;
        const maxReachableItem = currentItemRef.current + MAX_SPIN_ITEMS;
        const isNearEnd = maxReachableItem >= safeEnd - 10;

        function spinFromStart() {
            const candidates = findCandidates(trackDataRef.current, currentItemRef.current, targetColor, visibleItems);
            if (candidates.length === 0) return;

            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            const targetOffset = pickTargetOffset(pick.absoluteIndex, centerOffset);

            currentItemRef.current = pick.absoluteIndex;

            spinTo(targetOffset, () => {
                setIsSpinning(false);
                handleFinish();
            });
        }

        if (isNearEnd) {
            resetTrack(() => {
                trackDataRef.current = buildTrack();
                setRenderTrack(trackDataRef.current);
                currentItemRef.current = 0;
                positionRef.current.x = 0;
                spinFromStart();
            });
            return;
        }

        spinFromStart();
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <RouletteTrack track={renderTrack} trackRef={trackRef} viewportWidth={viewportWidth} />
            <Button variant="contained" size="large" disabled={!canPlay} onClick={handleSpinClick}>
                Spin
            </Button>
        </Box>
    );
}