"use client";

import { Typography } from "@mui/material";

interface TotalPlayedStatProps {
    totalGames: number;
}

export default function TotalPlayedStat({ totalGames }: TotalPlayedStatProps) {
    return <Typography>Total games played {totalGames}</Typography>;
}