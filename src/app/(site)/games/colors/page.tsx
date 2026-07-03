"use client";

import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";

import { api } from "@/lib/client/api";
import { playLoseConfetti, playWinConfetti } from "@/lib/client/confetti";
import { useHistory, useMe } from "@/lib/client/hooks/data";
import { GAMES } from "@/lib/client/registry/games";
import { playRandomSfxByPrefix } from "@/lib/client/sfx";
import { playSchema } from "@/lib/client/validation";
import { CURRENCY_TICKER } from "@/lib/config";

import AmountInput from "@/components/shared/action/AmountInput";
import GameStatusDisplay from "@/components/shared/action/GameStatusDisplay";
import HistoryTable from "@/components/shared/data/HistoryList";
import SectionHeader from "@/components/shared/generic/SectionHeader";
import { showSnackbar } from "@/components/shared/generic/SnackBar";

import ColorsGameBox from "./_components/ColorsGameBox";

import { HistoryReason } from "@/types/models";
import type { GameResult } from "@/types/api";

const game = GAMES.find((game) => game.id === HistoryReason.Game.COLORS)!;

type GamePhase = "idle" | "pending" | "animating";

export default function ColorsPage() {
    const { me, mutate } = useMe();
    const { rows, isLoading: historyLoading, mutate: mutateHistory } = useHistory(me?.username ?? null);

    const [phase, setPhase] = useState<GamePhase>("idle");
    const [amount, setAmount] = useState<number | null>(null);
    const [result, setResult] = useState<GameResult | null>(null);
    const [displayResult, setDisplayResult] = useState<GameResult | null>(null);

    const isLocked = phase !== "idle";
    const balance = me?.balance ?? 0;
    const amountValid = amount !== null;

    async function handlePlay() {
        if (amount === null) return;

        setPhase("pending");

        try {
            const res = await api.user.play(game.id, amount);
            setResult(res);
            setPhase("animating");
        } catch {
            setPhase("idle");
        }
    }

    function handleFinish() {
        if (result === null) return;

        if (result.delta > 0) {
            showSnackbar(`You Won +${result.delta.toLocaleString()} ${CURRENCY_TICKER}`!, "win")
            playRandomSfxByPrefix("win")
            playWinConfetti()
        } else {
            showSnackbar(`You lost -${Math.abs(result.delta).toLocaleString()} ${CURRENCY_TICKER}!`, "lose")
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
            <Stack direction="row" flexWrap="wrap">
                <Stack flex={2}>
                    <Stack>
                        <SectionHeader icon={game.icon} label={game.label} />
                        <Typography>{game.desc}</Typography>
                    </Stack>
                    <Stack marginY={4}>
                        <ColorsGameBox
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
                <Stack flex={2} gap={1} minWidth={300}>
                    <SectionHeader icon="mdi:history" label="Recent Activity" />
                    <HistoryTable
                        rows={rows}
                        type={game.id}
                        isLoading={historyLoading}
                        maxRowsPerPage={5}
                    />
                </Stack>
                <Stack flex={1} gap={1} minWidth={200}>
                    <Box />
                </Stack>
            </Stack>
        </Stack>
    );
}