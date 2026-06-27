"use client";

import { Box, Paper, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HISTORY_META } from "@/lib/client/registry/history";
import Iconify from "@/components/shared/generic/Iconify";
import type { HistoryDetail } from "@/types/models";

interface TransactionHeaderProps {
    transaction: HistoryDetail | null;
    isLoading: boolean;
    hasError: boolean;
}

export default function TransactionHeader({ transaction, isLoading, hasError }: TransactionHeaderProps) {
    const theme = useTheme();

    if (isLoading) {
        return (
            <Paper elevation={1} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, borderRadius: 2 }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="50%" height={32} />
                    <Skeleton variant="text" width="35%" />
                </Box>
            </Paper>
        );
    }

    if (hasError || !transaction) {
        return (
            <Paper elevation={1} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, borderRadius: 2 }}>
                <Iconify icon="mdi:receipt-text-remove" sx={{ fontSize: 40, color: "text.disabled" }} />
                <Typography color="text.secondary">Transaction not found</Typography>
            </Paper>
        );
    }

    const meta = HISTORY_META[transaction.reason];
    const { label, icon } = meta ?? { label: transaction.reason, icon: "fa:question" };
    const isPositive = transaction.change > 0;
    const iconColor = isPositive ? theme.palette.success.main : theme.palette.error.main;

    return (
        <Paper elevation={1} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, borderRadius: 2 }}>
            <Iconify icon={icon} sx={{ fontSize: 40, color: iconColor, flexShrink: 0 }} />
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" noWrap>{label}</Typography>
                <Typography variant="body2" color="text.secondary" fontFamily="monospace" noWrap>
                    {transaction.id}
                </Typography>
            </Box>
        </Paper>
    );
}