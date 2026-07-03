"use client";

import { useRouter } from "next/navigation";
import { Avatar, Box, ButtonBase, Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { getAvatarUrl } from "@/lib/client/utils";
import { CURRENCY_TICKER } from "@/lib/config";
import type { HistoryDetail } from "@/types/models";

interface TransactionDetailsProps {
    transaction: HistoryDetail | null;
    isLoading: boolean;
    hasError: boolean;
}

interface DetailRowProps {
    label: string;
    children: React.ReactNode;
}

function DetailRow({ label, children }: DetailRowProps) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography color="text.secondary">{label}</Typography>
            {children}
        </Stack>
    );
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatChange(change: number): string {
    return change > 0 ? `+${change.toLocaleString()}` : change.toLocaleString();
}

function ClickableUsername({ username }: { username: string }) {
    const router = useRouter();

    function handleClick() {
        router.push(`/users/${username}`);
    }

    return (
        <ButtonBase
            onClick={handleClick}
            sx={{ borderRadius: 2, px: 1, py: 0.5, gap: 1, display: "flex", alignItems: "center" }}
        >
            <Avatar src={getAvatarUrl(username)} alt={username} sx={{ width: 24, height: 24 }} />
            <Typography fontWeight="bold">{username}</Typography>
        </ButtonBase>
    );
}

function TransactionDetailsSkeleton() {
    return (
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Stack gap={2}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Stack key={i} direction="row" justifyContent="space-between">
                        <Skeleton variant="text" width="30%" />
                        <Skeleton variant="text" width="40%" />
                    </Stack>
                ))}
            </Stack>
        </Paper>
    );
}

export default function TransactionDetails({ transaction, isLoading, hasError }: TransactionDetailsProps) {
    if (isLoading) {
        return <TransactionDetailsSkeleton />;
    }

    if (hasError || !transaction) {
        return null;
    }

    const isPositive = transaction.change > 0;
    const changeColor = isPositive ? "success.main" : "error.main";
    const metaEntries = Object.entries(transaction.meta ?? {});

    return (
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Stack gap={2}>
                <DetailRow label="From">
                    <ClickableUsername username={transaction.username} />
                </DetailRow>

                <DetailRow label="Amount">
                    <Typography fontFamily="monospace" fontWeight="bold" sx={{ color: changeColor }}>
                        {formatChange(transaction.change)} {CURRENCY_TICKER}
                    </Typography>
                </DetailRow>

                <DetailRow label="Reason">
                    <Typography fontFamily="monospace">{transaction.reason}</Typography>
                </DetailRow>
                {metaEntries.length > 0 && (
                    <>
                        <Divider />
                        {metaEntries.map(([key, value]) => (
                            <DetailRow key={key} label={key}>
                                {key === "player" ? (
                                    <ClickableUsername username={String(value)} />
                                ) : (
                                    <Typography>{String(value)}</Typography>
                                )}
                            </DetailRow>
                        ))}
                    </>
                )}
                <Divider />

                <DetailRow label="Date">
                    <Typography>{formatDate(transaction.created_at)}</Typography>
                </DetailRow>
            </Stack>
        </Paper>
    );
}