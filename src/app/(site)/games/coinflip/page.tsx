"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";

import AmountInput from "@/components/shared/action/AmountInput";
import PlayButton from "@/components/shared/action/PlayButton";
import BalanceDisplay from "@/components/shared/data/BalanceDisplay";
import ChoiceMenu from "./_components/ChoiceMenu";
import Visualizer from "./_components/Visualizer";

import { useMe } from "@/lib/client/hooks/data";
import { api } from "@/lib/client/api";
import { BET_MIN, BET_MAX } from "@/lib/config";
import { HistoryReason } from "@/types/models";

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
            mutateMe();
        } catch {
            setIsLocked(false);
        }
    }

    function handleFinish() {
        setIsLocked(false);
        setResult(null);
        setChoice(null);
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Coinflip</Typography>

            <BalanceDisplay balance={me?.balance ?? 0} />

            <ChoiceMenu
                value={choice}
                onChange={setChoice}
                error={errors.choice}
                disabled={isLocked}
            />

            <AmountInput
                value={amount}
                onChange={setAmount}
                balance={me?.balance ?? 0}
                min={BET_MIN}
                max={BET_MAX}
                disabled={isLocked}
                externalError={errors.amount ?? undefined}
            />

            <PlayButton onClick={handlePlay} disabled={isLocked} label="Flip" />

            <Visualizer result={result} onFinish={handleFinish} />
        </Box>
    );
}