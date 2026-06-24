"use client";

import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

import { api } from "@/lib/client/api";
import { getErrorMessage } from "@/lib/client/errors";
import { transferSchema } from "@/lib/client/validation";
import { showSnackbar } from "@/components/shared/generic/SnackBar";
import AmountInput from "@/components/shared/action/AmountInput";

interface Props {
    balance: number;
    onSuccess: () => void;
}

function getErrorCode(error: unknown): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "code" in error.response.data &&
        typeof error.response.data.code === "string"
    ) {
        return error.response.data.code;
    }

    return "SERVER_ERROR";
}

export default function TransferForm({ balance, onSuccess }: Props) {
    const [username, setUsername] = useState("");
    const [amount, setAmount] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const usernameParsed = transferSchema.shape.username.safeParse(username);
    const isUsernameValid = usernameParsed.success;
    const isAmountValid = amount !== null;
    const canSend = isUsernameValid && isAmountValid && !isSubmitting && balance > 0;

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
    }

    async function handleSend() {
        if (!canSend) return;
    
        setIsSubmitting(true);
    
        try {
            await api.user.transfer(username, amount);
            showSnackbar(`Sent ${amount.toLocaleString()} to ${username}`, "win");
            setUsername("");
            setAmount(null);
            onSuccess();
        } catch (error) {
            const code = error instanceof Object && "code" in error ? String(error.code) : "INTERNAL_ERROR";
            showSnackbar(getErrorMessage(code), "lose");
        } finally {
            setIsSubmitting(false);
        }
    }

    const usernameErrorMessage = !isUsernameValid
        ? usernameParsed.error.issues[0].message
        : "Recipient username";

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
                label={usernameErrorMessage}
                value={username}
                onChange={handleUsernameChange}
                size="small"
                fullWidth
                error={!isUsernameValid}
                disabled={isSubmitting}
                slotProps={{
                    inputLabel: {
                        shrink: !isUsernameValid ? true : undefined,
                    },
                }}
            />
            <AmountInput
                amount={amount}
                setAmount={setAmount}
                balance={balance}
                isLocked={isSubmitting}
                schema={transferSchema.shape.amount}
            />
            <Button
                variant="contained"
                onClick={handleSend}
                disabled={!canSend}
                fullWidth
            >
                Send
            </Button>
        </Box>
    );
}