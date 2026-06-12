"use client";

import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ApiResult } from "../page";

// The three choices the player can make.
// The value is display-only. it is not sent to the API.
const CHOICES = [
    { value: "rock", label: "Rock" },
    { value: "paper", label: "Paper" },
    { value: "scissors", label: "Scissors" },
];

// --- RPSGame ---
// Pure render layer. Owns no async logic.
// Calls onChoice when the player picks, receives face to render the outcome.

interface GameProps {
    canPlay: boolean;
    onChoice: (value: string) => void;
    face: "win" | "lose" | null;
    // The choice the player made, used only for display during the reveal.
    chosenValue: string | null;
}

function RPSGame({ canPlay, onChoice, face, chosenValue }: GameProps) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            {/* Choice buttons, disabled while locked or result is showing */}
            <Box sx={{ display: "flex", gap: 2 }}>
                {CHOICES.map((choice) => (
                    <Button
                        key={choice.value}
                        variant={chosenValue === choice.value ? "contained" : "outlined"}
                        disabled={!canPlay}
                        onClick={() => onChoice(choice.value)}
                        sx={{ minWidth: 100 }}
                    >
                        {choice.label}
                    </Button>
                ))}
            </Box>

            {/* Outcome display (optional), only shown after the delay resolves */}
            {face !== null && (
                <Typography
                    variant="h5"
                    color={face === "win" ? "success.main" : "error.main"}
                >
                    {face === "win" ? "You win!" : "You lose."}
                </Typography>
            )}
        </Box>
    );
}

// --- RPSVisualizer ---
// Adapter between the page and RPSGame.
// Owns local UI state: face and chosenValue.
// Triggers handlePlay on choice, triggers handleFinish after the reveal delay.

interface VisualizerProps {
    handlePlay: (choice: string) => Promise<void>;
    handleFinish: () => void;
    result: ApiResult | null;
    isLocked: boolean;
    amountValid: boolean;
}

const REVEAL_DELAY_MS = 1500;

export default function RPSVisualizer({
    handlePlay,
    handleFinish,
    result,
    isLocked,
    amountValid,
}: VisualizerProps) {
    const [face, setFace] = useState<"win" | "lose" | null>(null);
    const [chosenValue, setChosenValue] = useState<string | null>(null);

    // canPlay gates both picking a choice and re-picking mid-round
    const canPlay = !isLocked && amountValid;

    // When result arrives, wait for the delay (simulate animation) then reveal and finish
    useEffect(() => {
        if (result === null) return;

        const timer = setTimeout(() => {
            setFace(result.won ? "win" : "lose");
            handleFinish();
        }, REVEAL_DELAY_MS);

        return () => clearTimeout(timer);
    }, [result]);

    async function handleChoice(value: string) {
        if (!canPlay) return;

        // Reset previous round state before starting a new one
        setFace(null);
        setChosenValue(value);

        await handlePlay(value);
    }

    return (
        <RPSGame
            canPlay={canPlay}
            onChoice={handleChoice}
            face={face}
            chosenValue={chosenValue}
        />
    );
}