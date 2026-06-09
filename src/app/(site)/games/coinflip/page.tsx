"use client";

import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";

import AmountInput from "@/components/shared/action/AmountInput";
import PlayButton from "@/components/shared/action/PlayButton";
import ChoiceMenu from "./_components/ChoiceMenu";
import Visualizer from "./_components/Visualizer";

import { useMe } from "@/lib/client/hooks/data";
import { api } from "@/lib/client/api";
import { BET_MIN, BET_MAX } from "@/lib/config";
import { HistoryReason } from "@/types/models";
import SectionHeader from "@/components/shared/generic/SectionHeader";
import GameResult from "@/components/shared/data/GameResult";

type CoinSide = "heads" | "tails";

interface FormErrors {
    amount: string | null;
    choice: string | null;
}

function validate(amount: string, choice: CoinSide | null): FormErrors {
    const num = Number(amount);
    const amountError = amount === "" || isNaN(num) || num <= 0 ? "Enter a valid amount" : null;
    const choiceError = choice === null ? "Pick heads or tails" : null;
    return { amount: amountError, choice: choiceError };
}

export default function CoinflipPage() {
    const [amount, setAmount] = useState("");
    const [choice, setChoice] = useState<CoinSide | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [result, setResult] = useState<{ won: boolean; delta: number; balance: number } | null>(null);
    const [errors, setErrors] = useState<FormErrors>({ amount: null, choice: null });

    const { me, mutate: mutateMe } = useMe();

    async function handlePlay() {
        const validated = validate(amount, choice);
        const hasErrors = validated.amount !== null || validated.choice !== null;

        if (hasErrors) {
            setErrors(validated);
            return;
        }

        setErrors({ amount: null, choice: null });
        setIsLocked(true);

        try {
            const response = await api.user.play(HistoryReason.Game.COINFLIP, Number(amount));
            setResult(response.data.data);
        } catch {
            setIsLocked(false);
        }
    }

    function handleFinish() {
        setIsLocked(false);
        mutateMe();
    }

    return (
        <Stack gap={4} sx={{ minWidth: 0, overflow: "hidden", p: { sm: 1, md: 2 } }}>
            <Stack direction={{ xs: "column", md: "row" }} gap={4}>
                <Stack flex={2} gap={1}>
                    <SectionHeader icon="mdi:coin-outline" label="Coinflip" />
                    <Visualizer result={result} choice={choice} onFinish={handleFinish} />
                </Stack>
    
                <Stack flex={1} gap={2}>
                    <Stack gap={1}>
                        <GameResult result={result} isLocked={isLocked} />
                    </Stack>
                    <Stack gap={1}>
                        <SectionHeader icon="mdi:hand-coin-outline" label="Your Pick" />
                        <ChoiceMenu
                            value={choice}
                            onChange={setChoice}
                            error={errors.choice}
                            disabled={isLocked}
                        />
                    </Stack>
    
                    <Stack gap={1}>
                        <SectionHeader icon="mdi:wallet-outline" label="Bet" />
                        <AmountInput
                            value={amount}
                            onChange={setAmount}
                            balance={me?.balance ?? 0}
                            min={BET_MIN}
                            max={BET_MAX}
                            disabled={isLocked}
                            externalError={errors.amount ?? undefined}
                        />
                    </Stack>
    
                    <PlayButton onClick={handlePlay} disabled={isLocked} label="Flip" />
                </Stack>
            </Stack>
        </Stack>
    );
}