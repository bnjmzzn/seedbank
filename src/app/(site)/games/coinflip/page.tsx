"use client";

import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useHistory, useMe } from "@/lib/client/hooks/data";
import { api } from "@/lib/client/api";
import { HistoryReason } from "@/types/models";
import AmountInput from "@/components/shared/action/AmountInput";
import CoinflipVisualizer from "./_components/CoinflipGameBox";
import { playSchema } from "@/lib/client/validation";
import { playLoseConfetti, playWinConfetti } from "@/lib/client/confetti";
import { playRandomSfxByPrefix } from "@/lib/client/sfx";
import SectionHeader from "@/components/shared/generic/SectionHeader";
import { GAMES } from "@/lib/client/registry/games";
import GameStatusDisplay from "@/components/shared/action/GameStatusDisplay";
import HistoryTable from "@/components/shared/data/HistoryList";

const game = GAMES.find((game) => game.id === HistoryReason.Game.COINFLIP)!;

type GamePhase = "idle" | "pending" | "animating";

export interface ApiResult {
    won: boolean;
    delta: number;
    balance: number;
}

export default function CoinflipPage() {
    const { me, mutate } = useMe();
    const { rows, isLoading: historyLoading, mutate: mutateHistory } = useHistory(me?.username ?? null);

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
        mutateHistory();
    }

    return (
        <Stack gap={4} sx={{ minWidth: 0, overflow: "hidden", p: { sm: 1, md: 2 } }}>
            <Stack direction="row" flexWrap="wrap" gap={4}>
                <Stack flex={2}>
                    <Stack>
                        <SectionHeader icon={game.icon} label={game.label} />
                        <Typography>{game.desc}</Typography>
                    </Stack>
                    <Stack marginY={4}>
                        <CoinflipVisualizer
                            handlePlay={handlePlay}
                            handleFinish={handleFinish}
                            result={result}
                            isLocked={isLocked}
                            amountValid={amountValid}
                        />
                    </Stack>
                </Stack>
                <Stack flex={1} gap={2}>
                    <SectionHeader icon="mdi:input" label="Place bet" />
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
                    />
                </Stack>
            </Stack>
            <Stack direction="row" flexWrap="wrap" gap={4}>
                <Stack flex={2} gap={1}>
                    <SectionHeader icon="mdi:history" label="Recent Activity" />
                    <HistoryTable
                        rows={rows}
                        type={game.id}
                        isLoading={historyLoading}
                        maxRowsPerPage={5}
                    />
                </Stack>
                <Stack flex={1} gap={1}>
                    <Box />
                </Stack>
            </Stack>
        </Stack>
    );
}