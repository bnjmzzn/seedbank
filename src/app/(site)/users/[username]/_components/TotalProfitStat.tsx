"use client";

import { Typography } from "@mui/material";

interface TotalProfitStatProps {
    totalProfit: number;
}

export default function TotalProfitStat({ totalProfit }: TotalProfitStatProps) {
    return <Typography>Total profit {totalProfit}</Typography>;
}