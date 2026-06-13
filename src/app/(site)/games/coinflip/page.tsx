"use client";

import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useMe } from "@/lib/client/hooks/data";
import { api } from "@/lib/client/api";
import { HistoryReason } from "@/types/models";
import AmountInput from "@/components/shared/action/AmountInput";
import CoinflipVisualizer from "./_components/CoinflipVisualizer";
import { playSchema } from "@/lib/client/validation";
import { playLoseConfetti, playWinConfetti } from "@/lib/client/confetti";
import { playRandomSfxByPrefix } from "@/lib/client/sfx";
import SectionHeader from "@/components/shared/generic/SectionHeader";
import { GAMES } from "@/lib/client/registry/games";
import GameStatusDisplay from "@/components/shared/action/GameStatusDisplay";

const game = GAMES.find((game) => game.id === HistoryReason.Game.COINFLIP)!;

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
    const [displayResult, setDisplayResult] = useState<ApiResult | null>(null);

    const isLocked = phase !== "idle";
    const balance = me?.balance ?? 0;
    const amountValid = amount !== null;

    async function handlePlay() {
        if (amount === null) return;

        setPhase("pending");

        try {
            const res = await api.user.play(game.id, amount);
            setResult(res.data.data);
            setPhase("animating");
        } catch {
            setPhase("idle");
        }
    }

    function handleFinish() {
        if (result === null) return;

        if (result.delta > 0) {
            playRandomSfxByPrefix("win")
            playWinConfetti()
        } else {
            playRandomSfxByPrefix("lose")
            playLoseConfetti()
        }

        setDisplayResult(result);
        setPhase("idle");
        mutate();
    }

    return (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, p: 2 }}>
            <Stack sx={{ flex: 2 }}>
                <SectionHeader icon={game.icon} label={game.label} />
                <Typography>
                    { game.desc }
                </Typography>
            </Stack>

            <CoinflipVisualizer
                handlePlay={handlePlay}
                handleFinish={handleFinish}
                result={result}
                isLocked={isLocked}
                amountValid={amountValid}
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                <SectionHeader icon="mdi:table" label="Current Session" />
                <Stack sx={{ gap: 2 }}>
                    <AmountInput
                        amount={amount}
                        setAmount={setAmount}
                        balance={balance}
                        isLocked={isLocked}
                        schema={playSchema.shape.amount}
                    />
                    <GameStatusDisplay
                        isLocked={isLocked}
                        result={displayResult}
                        amountValid={amountValid}
                        readyLabel="Pick your choice"
                    />
                </Stack>
            </Box>
        </Box>
    );
}