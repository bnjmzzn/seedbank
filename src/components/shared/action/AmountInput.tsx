"use client";

import { TextField, Box, Button } from "@mui/material";
import { CURRENCY_TICKER } from "@/lib/config";

interface Props {
    value: string;
    onChange: (value: string) => void;
    balance: number;
    min?: number;
    max?: number;
    disabled?: boolean;
    label?: string;
    externalError?: string;
}

const PRESETS = [
    { label: "10%", factor: 0.1 },
    { label: "50%", factor: 0.5 },
    { label: "100%", factor: 1 },
];

function getError(value: string, balance: number, min?: number, max?: number): string | null {
    if (value === "") return null;

    const num = Number(value);

    if (isNaN(num) || num <= 0) return "Must be a positive number";
    if (num > balance) return "Exceeds your balance";
    if (min !== undefined && num < min) return `Min ${min.toLocaleString()} ${CURRENCY_TICKER}`;
    if (max !== undefined && num > max) return `Max ${max.toLocaleString()} ${CURRENCY_TICKER}`;

    return null;
}

export default function AmountInput({ value, onChange, balance, min, max, disabled, label = "Amount", externalError }: Props) {
    const internalError = getError(value, balance, min, max);
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