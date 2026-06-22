"use client";

import { Paper, Typography, Box, Skeleton } from "@mui/material";
import { useCountUp } from "@/lib/client/hooks/ui";
import Iconify from "@/components/shared/generic/Iconify";

interface BalanceStatProps {
    balance?: number;
    isLoading?: boolean;
}

const paperSx = {
    minWidth: 140,
    display: "flex",
    flex: 1,
    alignItems: "center",
    gap: 2,
    p: 2,
};

export default function BalanceStat({ balance, isLoading }: BalanceStatProps) {
    const animatedBalance = useCountUp(balance ?? 0);

    if (isLoading) {
        return (
            <Paper sx={paperSx} elevation={0}>
                <Skeleton variant="rounded" width={44} height={44} sx={{ flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="70%" height={32} />
                </Box>
            </Paper>
        );
    }

    return (
        <Paper sx={paperSx} elevation={0}>
            <Box sx={{
                bgcolor: "primary.main",
                borderRadius: 1.5,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}>
                <Iconify icon="mdi:wallet" sx={{ color: "primary.contrastText" }} />
            </Box>
            <Box>
                <Typography color="text.secondary">Balance</Typography>
                <Typography variant="h5" fontWeight="bold">
                    {balance !== undefined ? animatedBalance.toLocaleString() : "-"}
                </Typography>
            </Box>
        </Paper>
    );
}