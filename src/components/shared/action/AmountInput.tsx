"use client";

import { TextField, Box, Button, Typography } from "@mui/material";
import { CURRENCY_TICKER, BET_MIN, BET_MAX } from "@/lib/config";

interface Props {
    value: string;
    onChange: (value: string) => void;
    balance: number;
    disabled?: boolean;
    label?: string;
    externalError?: string;
}

const PRESETS = [
    { label: "10%", factor: 0.1 },
    { label: "50%", factor: 0.5 },
    { label: "100%", factor: 1 },
];

function getError(value: string, balance: number): string | null {
    if (value === "") return null;

    const num = Number(value);

    if (isNaN(num) || num <= 0) return "Must be a positive number";
    if (num > balance) return "Exceeds your balance";
    if (num < BET_MIN) return `Min ${BET_MIN.toLocaleString()} ${CURRENCY_TICKER}`;
    if (num > BET_MAX) return `Max ${BET_MAX.toLocaleString()} ${CURRENCY_TICKER}`;

    return null;
}

export default function AmountInput({ value, onChange, balance, disabled, label = "Amount", externalError }: Props) {
    const internalError = getError(value, balance);
    const activeError = externalError ?? internalError;
    const hasError = !!activeError;
    const inputLabel = hasError ? activeError : label;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange(e.target.value);
    }

    function handlePreset(factor: number) {
        onChange(String(Math.floor(balance * factor)));
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography color="text.secondary">
                Balance: {balance.toLocaleString()} {CURRENCY_TICKER}
            </Typography>
            <TextField
                label={inputLabel}
                value={value}
                onChange={handleChange}
                size="small"
                fullWidth
                type="number"
                error={hasError}
                disabled={disabled}
                slotProps={{
                    htmlInput: {
                        min: 0,
                        step: 1,
                        sx: {
                            "& input[type=number]": { MozAppearance: "textfield" },
                            "&::-webkit-outer-spin-button": { display: "none" },
                            "&::-webkit-inner-spin-button": { display: "none" },
                        }
                    },
                    inputLabel: { shrink: hasError ? true : undefined },
                }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
                {PRESETS.map((preset) => (
                    <Button
                        key={preset.label}
                        variant="contained"
                        onClick={() => handlePreset(preset.factor)}
                        disabled={disabled || balance <= 0}
                        sx={{ flex: 1, fontWeight: "bold" }}
                    >
                        {preset.label}
                    </Button>
                ))}
            </Box>
        </Box>
    );
}