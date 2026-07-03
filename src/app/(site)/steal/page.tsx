"use client";

import { useState } from "react";
import { Alert, Box, Button, Stack } from "@mui/material";

import { api } from "@/lib/client/api";
import { getErrorMessage } from "@/lib/client/errors";
import { playLoseConfetti, playWinConfetti } from "@/lib/client/confetti";
import { playRandomSfxByPrefix } from "@/lib/client/sfx";
import { stealSchema } from "@/lib/client/validation";
import { showSnackbar } from "@/components/shared/generic/SnackBar";
import { useHistory, useMe } from "@/lib/client/hooks/data";
import SectionHeader from "@/components/shared/generic/SectionHeader";
import HistoryTable from "@/components/shared/data/HistoryList";
import AmountInput from "@/components/shared/action/AmountInput";
import UsernameInput from "@/components/shared/action/UsernameInput";
import { CURRENCY_TICKER } from "@/lib/config";
import { NAV_ITEMS } from "@/lib/client/registry/nav";

const navEntry = NAV_ITEMS.find((item) => item.href === "/steal")!;

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

export default function StealPage() {
    const { me, mutate: mutateMe } = useMe();
    const { rows, isLoading: historyLoading, mutate: mutateHistory } = useHistory(me?.username ?? null);

    const [username, setUsername] = useState("");
    const [amount, setAmount] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [usernameError, setUsernameError] = useState<string | null>(null);

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
            const result = await api.user.steal(username, sentAmount);

            if (result.success) {
                showSnackbar(`Stole ${result.delta.toLocaleString()} ${CURRENCY_TICKER} from ${username}`, "win");
                playRandomSfxByPrefix("win");
                playWinConfetti();
            } else {
                showSnackbar(`Failed to steal from ${username}, lost ${Math.abs(result.delta).toLocaleString()} ${CURRENCY_TICKER}`, "lose");
                playRandomSfxByPrefix("lose");
                playLoseConfetti();
            }

            handleSuccess();
        } catch (error) {
            const code = isApiError(error) ? error.code : "INTERNAL_ERROR";
            if (code === "USER_NOT_FOUND") {
                setUsernameError(getErrorMessage(code));
            }
            showSnackbar(getErrorMessage(code), "error");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Stack gap={4} sx={{ minWidth: 0, overflow: "hidden", p: { sm: 1, md: 2 } }}>
            <Stack direction="row" flexWrap="wrap" gap={4}>
                <Stack flex={1} gap={1} minWidth={280}>
                <SectionHeader icon={navEntry.icon} label={`Steal ${CURRENCY_TICKER}s`} />
                    <Alert severity="error" variant="filled">
                        You are about to steal someone's hard earned {CURRENCY_TICKER}s. If the robbery fails, you lose the amount instead ;)
                    </Alert>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <UsernameInput
                            username={username}
                            setUsername={setUsername}
                            currentUsername={me?.username ?? null}
                            selfErrorCode="SELF_STEAL"
                            isLocked={isSubmitting}
                            schema={stealSchema.shape.username}
                            externalError={usernameError}
                            onExternalErrorClear={() => setUsernameError(null)}
                        />
                        <AmountInput
                            amount={amount}
                            setAmount={setAmount}
                            balance={balance}
                            isLocked={isSubmitting}
                            schema={stealSchema.shape.amount}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSend}
                            disabled={!canSend}
                            fullWidth
                        >
                            Steal
                        </Button>
                    </Box>
                </Stack>
                <Stack flex={2} gap={1} minWidth={280}>
                    <SectionHeader icon="mdi:history" label="Recent Activity" />
                    <HistoryTable
                        rows={rows}
                        type="STEAL"
                        isLoading={historyLoading}
                        maxRowsPerPage={5}
                    />
                </Stack>
            </Stack>
        </Stack>
    );
}