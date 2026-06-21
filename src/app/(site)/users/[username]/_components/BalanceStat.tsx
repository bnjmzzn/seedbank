"use client";

import { Typography } from "@mui/material";

interface BalanceStatProps {
    balance?: number;
}

export default function BalanceStat({ balance }: BalanceStatProps) {
    return <Typography>Balance {balance}</Typography>;
}