"use client";

import { useState } from "react";
import { TextField, Box, Button, Typography } from "@mui/material";
import { CURRENCY_TICKER } from "@/lib/config";
import { getErrorMessage } from "@/lib/client/errors";
import { z } from "zod";

interface Props {
    amount: number | null;
    setAmount: (value: number | null) => void;
    balance: number;
    isLocked?: boolean;
    schema: z.ZodNumber;
}

interface Validation {
    error: boolean;
    message: string;
}

const PRESETS = [
    { label: "10%", factor: 0.1 },
    { label: "50%", factor: 0.5 },
    { label: "100%", factor: 1 },
];

function validate(value: string, balance: number, schema: z.ZodNumber): Validation {
    if (value === "") return { error: false, message: "" };

    const parsed = schema.safeParse(Number(value));

    if (!parsed.success) return { error: true, message: parsed.error.issues[0].message };
    if (Number(value) > balance) return { error: true, message: getErrorMessage("INSUFFICIENT_BALANCE") };

    return { error: false, message: "" };
}

export default function AmountInput({ amount, setAmount, balance, isLocked, schema }: Props) {
    const [raw, setRaw] = useState(amount !== null ? String(amount) : "");

    const { error: isError, message: errorMessage } = validate(raw, balance, schema);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const str = e.target.value.replace(/[^0-9]/g, "");
        setRaw(str);
    
        const { error } = validate(str, balance, schema);
        setAmount(error || str === "" ? null : Number(str));
    }

    function handlePreset(factor: number) {
        const num = Math.floor(balance * factor);
        const str = String(num);
        setRaw(str);

        const { error } = validate(str, balance, schema);
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
                type="text"
                inputMode="numeric"
                error={isError}
                disabled={isLocked}
                slotProps={{
                    htmlInput: {
                        min: 0,
                        maxLength: 20,
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