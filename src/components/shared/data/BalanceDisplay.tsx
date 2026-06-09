"use client";

import { Typography } from "@mui/material";
import { CURRENCY_TICKER } from "@/lib/config";

interface Props {
    balance: number;
}

export default function BalanceDisplay({ balance }: Props) {
    return (
        <Typography variant="body2" color="text.secondary">
            Balance: {balance.toLocaleString()} {CURRENCY_TICKER}
        </Typography>
    );
}