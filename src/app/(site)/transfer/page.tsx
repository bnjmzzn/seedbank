"use client";

import { useState } from "react";
import { Box, Button, Stack } from "@mui/material";

import { api } from "@/lib/client/api";
import { getErrorMessage } from "@/lib/client/errors";
import { transferSchema } from "@/lib/client/validation";
import { showSnackbar } from "@/components/shared/generic/SnackBar";
import { useHistory, useMe } from "@/lib/client/hooks/data";
import SectionHeader from "@/components/shared/generic/SectionHeader";
import HistoryTable from "@/components/shared/data/HistoryList";
import AmountInput from "@/components/shared/action/AmountInput";
import UsernameInput from "@/components/shared/action/UsernameInput";
import { CURRENCY_TICKER } from "@/lib/config";

interface ApiError {
    code: string;
    status: number;
}

function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as ApiError).code === "string"
    );
}

export default function TransferPage() {
    const { me, mutate: mutateMe } = useMe();
    const { rows, isLoading: historyLoading, mutate: mutateHistory } = useHistory(me?.username ?? null);

    const [username, setUsername] = useState("");
    const [amount, setAmount] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const balance = me?.balance ?? 0;
    const canSend = username !== "" && amount !== null && !isSubmitting && balance > 0;

    function handleSuccess() {
        mutateMe();
        mutateHistory();
    }

    async function handleSend() {
        if (!canSend) return;

        const sentAmount = amount;
        if (sentAmount === null) return;

        setIsSubmitting(true);

        try {
            await api.user.transfer(username, sentAmount);
            showSnackbar(`Sent ${sentAmount.toLocaleString()} to ${username}`, "win");
            setUsername("");
            setAmount(null);
            handleSuccess();
        } catch (error) {
            const code = isApiError(error) ? error.code : "INTERNAL_ERROR";
            showSnackbar(getErrorMessage(code), "lose");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Stack gap={4} sx={{ minWidth: 0, overflow: "hidden", p: { sm: 1, md: 2 } }}>
            <Stack direction="row" flexWrap="wrap" gap={4}>
                <Stack flex={1} gap={1} minWidth={280}>
                    <SectionHeader icon="mdi:send-outline" label={`Send ${CURRENCY_TICKER}s`} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <UsernameInput
                            username={username}
                            setUsername={setUsername}
                            currentUsername={me?.username ?? null}
                            selfErrorCode="SELF_TRANSFER"
                            isLocked={isSubmitting}
                            schema={transferSchema.shape.username}
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
                </Stack>
                <Stack flex={2} gap={1} minWidth={280}>
                    <SectionHeader icon="mdi:history" label="Recent Activity" />
                    <HistoryTable
                        rows={rows}
                        type="TRANSFER"
                        isLoading={historyLoading}
                        maxRowsPerPage={5}
                    />
                </Stack>
            </Stack>
        </Stack>
    );
}