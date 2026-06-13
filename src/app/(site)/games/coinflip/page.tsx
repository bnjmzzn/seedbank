"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useMe } from "@/lib/client/hooks/data";
import { api } from "@/lib/client/api";
import { HistoryReason } from "@/types/models";
import AmountInput from "@/components/shared/action/AmountInput";
import CoinflipVisualizer from "./_components/CoinflipVisualizer";
import { playSchema } from "@/lib/client/validation";
import { playLoseConfetti, playWinConfetti } from "@/lib/client/confetti";

type GamePhase = "idle" | "pending" | "animating";

export interface ApiResult {
    won: boolean;
    delta: number;
    balance: number;
}

export default function CoinflipPage() {
    const { me, mutate } = useMe();

    const [phase, setPhase] = useState<GamePhase>("idle");
    const [amount, setAmount] = useState<number | null>(null);
    const [result, setResult] = useState<ApiResult | null>(null);

    const isLocked = phase !== "idle";
    const balance = me?.balance ?? 0;
    const amountValid = amount !== null;

    async function handlePlay() {
        if (amount === null) return;

        setPhase("pending");

        try {
            const res = await api.user.play(HistoryReason.Game.COINFLIP, amount);
            setResult(res.data.data);
            setPhase("animating");
        } catch {
            setPhase("idle");
        }
    }

    function handleFinish() {
        if (result === null) return;

        if (result.delta > 0) {
            playWinConfetti()
        } else {
            playLoseConfetti()
        }
        setPhase("idle");
        mutate();
    }

    return (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, p: 2 }}>
            <Box sx={{ flex: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                    Coinflip
                </Typography>
                <CoinflipVisualizer
                    handlePlay={handlePlay}
                    handleFinish={handleFinish}
                    result={result}
                    isLocked={isLocked}
                    amountValid={amountValid}
                />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                

                <AmountInput
                    amount={amount}
                    setAmount={setAmount}
                    balance={balance}
                    isLocked={isLocked}
                    schema={playSchema.shape.amount}
                />
            </Box>
        </Box>
    );
}