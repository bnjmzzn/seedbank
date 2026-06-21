"use client";

import { Typography } from "@mui/material";

interface WinRateStatProps {
    winRate: number;
}

export default function WinRateStat({ winRate }: WinRateStatProps) {
    return <Typography>Win rate {winRate.toFixed(1)}%</Typography>;
}