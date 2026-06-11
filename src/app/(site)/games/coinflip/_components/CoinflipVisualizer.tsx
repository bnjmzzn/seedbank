"use client";

import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ApiResult } from "../page";

// --- CoinflipGame ---

interface GameProps {
    canPlay: boolean;
    onChoice: (value: string) => void;
    face: "win" | "lose" | null;
}

const CHOICES = [
    { value: "heads", label: "Heads" },
    { value: "tails", label: "Tails" },
];

function CoinflipGame({ canPlay, onChoice, face }: GameProps) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: face === "win" ? "success.main" : face === "lose" ? "error.main" : "grey.700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h6" color="white">
                    {face === "win" ? "W" : face === "lose" ? "L" : "?"}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
                {CHOICES.map((choice) => (
                    <Button
                        key={choice.value}
                        variant="contained"
                        disabled={!canPlay}
                        onClick={() => onChoice(choice.value)}
                        sx={{ minWidth: 100 }}
                    >
                        {choice.label}
                    </Button>
                ))}
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
    const [face, setFace] = useState<"win" | "lose" | null>(null);
    const canPlay = !isLocked && amountValid;

    useEffect(() => {
        if (result === null) return;

        setFace(result.won ? "win" : "lose");
        handleFinish();
    }, [result]);

    async function handleChoice(_value: string) {
        if (!canPlay) return;
        setFace(null);
        await handlePlay();
    }

    return (
        <CoinflipGame
            canPlay={canPlay}
            onChoice={handleChoice}
            face={face}
        />
    );
}