"use client";

import { Paper, Typography, Box } from "@mui/material";

interface WinRateStatProps {
    winRate: number;
}

const paperSx = {
    minWidth: 140,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    p: 2,
};

export default function WinRateStat({ winRate }: WinRateStatProps) {
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