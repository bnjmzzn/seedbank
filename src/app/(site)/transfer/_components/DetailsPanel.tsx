"use client";

import { Box, TextField, Button, CircularProgress, Typography } from "@mui/material";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { TransferInput } from "@/lib/client/validation";

interface Props {
    control: Control<TransferInput>;
    errors: FieldErrors<TransferInput>;
    balance: number | null;
    isChecking: boolean;
    isConfirmed: boolean;
    onProceed: () => void;
    onClearErrors: () => void;
}

export default function DetailsPanel({ control, errors, balance, isChecking, isConfirmed, onProceed, onClearErrors }: Props) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                borderRadius: 3,
                px: 4,
                py: 3.5,
                flex: 1,
            }}
        >
            <Typography variant="subtitle1" fontWeight={700}>
                Details
            </Typography>

            <Controller
                name="username"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Recipient username"
                        error={!!errors.username}
                        helperText={errors.username?.message ?? " "}
                        fullWidth
                        disabled={isChecking || isConfirmed}
                        onChange={(e) => {
                            field.onChange(e);
                            onClearErrors();
                        }}
                    />
                )}
            />

            <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Amount"
                        type="number"
                        value={field.value === 0 ? "" : field.value}
                        onChange={(e) => {
                            field.onChange((e.target as HTMLInputElement).valueAsNumber);
                            onClearErrors();
                        }}
                        error={!!errors.amount}
                        helperText={
                            errors.amount?.message ??
                            (balance !== null ? `Your balance: ${balance.toLocaleString()} seeds` : " ")
                        }
                        fullWidth
                        disabled={isChecking || isConfirmed}
                    />
                )}
            />

            <Button
                variant="contained"
                onClick={onProceed}
                disabled={isChecking || isConfirmed}
                size="large"
                startIcon={isChecking ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : null}
                sx={{ alignSelf: "flex-end", color: "common.black", fontWeight: 700 }}
            >
                {isChecking ? "Checking..." : "Proceed"}
            </Button>
        </Box>
    );
}