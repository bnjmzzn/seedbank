"use client";

import { Typography } from "@mui/material";

interface TotalLostStatProps {
    totalLost: number;
}

export default function TotalLostStat({ totalLost }: TotalLostStatProps) {
    return <Typography>Total lost {totalLost}</Typography>;
}