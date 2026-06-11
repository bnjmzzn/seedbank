"use client";

import { useState } from "react";
import { TextField, Box, Button, Typography } from "@mui/material";
import { CURRENCY_TICKER } from "@/lib/config";
import { playSchema } from "@/lib/client/validation";
import { getErrorMessage } from "@/lib/client/errors";

interface Props {
    amount: number | null;
    setAmount: (value: number | null) => void;
    balance: number;
    isLocked?: boolean;
}

const PRESETS = [
    { label: "10%", factor: 0.1 },
    { label: "50%", factor: 0.5 },
    { label: "100%", factor: 1 },
];

function getValidation(value: string, balance: number): { error: boolean; message: string } {
    if (value === "") return { error: false, message: "" };

    const result = playSchema.shape.amount.safeParse(Number(value));

    if (!result.success) return { error: true, message: result.error.issues[0].message };
    if (Number(value) > balance) return { error: true, message: getErrorMessage("INSUFFICIENT_BALANCE") };

    return { error: false, message: "" };
}

export default function AmountInput({ amount, setAmount, balance, isLocked }: Props) {
    const [raw, setRaw] = useState(amount !== null ? String(amount) : "");

    const { error: isError, message: errorMessage } = getValidation(raw, balance);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const str = e.target.value;
        setRaw(str);

        const { error } = getValidation(str, balance);
        setAmount(error || str === "" ? null : Number(str));
    }

    function handlePreset(factor: number) {
        const num = Math.floor(balance * factor);
        const str = String(num);
        setRaw(str);

        const { error } = getValidation(str, balance);
        setAmount(error ? null : num);
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography color="text.secondary">
                Balance: {balance.toLocaleString()} {CURRENCY_TICKER}
            </Typography>
            <TextField
                label={isError ? errorMessage : "Amount"}
                value={raw}
                onChange={handleChange}
                size="small"
                fullWidth
                type="number"
                error={isError}
                disabled={isLocked}
                slotProps={{
                    htmlInput: {
                        min: 0,
                        step: 1,
                        sx: {
                            "& input[type=number]": { MozAppearance: "textfield" },
                            "&::-webkit-outer-spin-button": { display: "none" },
                            "&::-webkit-inner-spin-button": { display: "none" },
                        },
                    },
                }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
                {PRESETS.map((preset) => (
                    <Button
                        key={preset.label}
                        variant="contained"
                        onClick={() => handlePreset(preset.factor)}
                        disabled={isLocked || balance <= 0}
                        sx={{ flex: 1, fontWeight: "bold" }}
                    >
                        {preset.label}
                    </Button>
                ))}
            </Box>
        </Box>
    );
}