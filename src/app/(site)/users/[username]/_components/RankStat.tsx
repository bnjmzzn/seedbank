"use client";

import { Typography } from "@mui/material";

interface RankStatProps {
    rank?: number;
}

export default function RankStat({ rank }: RankStatProps) {
    return <Typography>Rank #{rank}</Typography>;
}