"use client";

import { Box, Typography, Avatar, Button, CircularProgress, Skeleton } from "@mui/material";
import { getAvatarUrl } from "@/lib/client/avatar";

interface RecipientProfile {
    username: string;
    balance: number;
}

interface SummaryRowProps {
    username: string;
    currentBalance: number;
    balanceAfter: number;
    amount: number;
    variant: "sender" | "receiver";
}

function SummaryRow({ username, currentBalance, balanceAfter, amount, variant }: SummaryRowProps) {
    const isSender = variant === "sender";
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: "action.selected",
                borderRadius: 2,
                px: 2,
                py: 1.5,
            }}
        >
            <Avatar src={getAvatarUrl(username)} sx={{ width: 40, height: 40, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                    @{username}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                    {currentBalance.toLocaleString()} → {balanceAfter.toLocaleString()}
                </Typography>
            </Box>
            <Typography
                variant="body1"
                fontWeight={800}
                fontFamily="monospace"
                color={isSender ? "error.main" : "success.main"}
                flexShrink={0}
            >
                {isSender ? "-" : "+"}{amount.toLocaleString()}
            </Typography>
        </Box>
    );
}

function SummaryRowSkeleton() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: "action.selected",
                borderRadius: 2,
                px: 2,
                py: 1.5,
            }}
        >
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="text" width={140} />
            </Box>
            <Skeleton variant="text" width={60} />
        </Box>
    );
}

interface Props {
    senderUsername: string;
    senderBalance: number;
    recipient: RecipientProfile | null;
    amount: number;
    isSubmitting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function SummaryPanel({
    senderUsername,
    senderBalance,
    recipient,
    amount,
    isSubmitting,
    onCancel,
    onConfirm,
}: Props) {
    const ready = recipient !== null;

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
            <Typography variant="h6" fontWeight={700}>
                Summary
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                {ready ? (
                    <>
                        <SummaryRow
                            username={senderUsername}
                            currentBalance={senderBalance}
                            balanceAfter={senderBalance - amount}
                            amount={amount}
                            variant="sender"
                        />
                        <SummaryRow
                            username={recipient.username}
                            currentBalance={recipient.balance}
                            balanceAfter={recipient.balance + amount}
                            amount={amount}
                            variant="receiver"
                        />
                    </>
                ) : (
                    <>
                        <SummaryRowSkeleton />
                        <SummaryRowSkeleton />
                    </>
                )}
            </Box>

            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", mt: "auto" }}>
                <Button
                    onClick={onCancel}
                    color="inherit"
                    disabled={!ready || isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={onConfirm}
                    disabled={!ready || isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : null}
                    sx={{ color: "common.black", fontWeight: 700 }}
                >
                    {isSubmitting ? "Transferring..." : "Confirm"}
                </Button>
            </Box>
        </Box>
    );
}