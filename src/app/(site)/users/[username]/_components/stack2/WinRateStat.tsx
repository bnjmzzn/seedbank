"use client";

import { Paper, Typography, Box, Skeleton } from "@mui/material";

interface WinRateStatProps {
    winRate: number;
    isLoading?: boolean;
}

const paperSx = {
    minWidth: 140,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    p: 2,
};

export default function WinRateStat({ winRate, isLoading }: WinRateStatProps) {
    if (isLoading) {
        return (
            <Paper sx={paperSx} elevation={0}>
                <Skeleton variant="text" width="40%" height={40} />
                <Skeleton variant="text" width="80%" />
            </Paper>
        );
    }

    const isHealthy = winRate >= 50;
    const valueColor = isHealthy ? "primary.main" : "error.main";

    return (
        <Paper sx={paperSx} elevation={0}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: valueColor }}>
                {winRate.toFixed(1)}%
            </Typography>
            <Box>
                <Typography color="text.secondary">Total Win Rate</Typography>
            </Box>
        </Paper>
    );
}