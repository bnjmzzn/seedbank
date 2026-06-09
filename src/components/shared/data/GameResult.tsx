"use client";

import { Typography } from "@mui/material";
import { CURRENCY_TICKER } from "@/lib/config";

interface GameResult {
    won: boolean;
    delta: number;
    balance: number;
}

interface Props {
    result: GameResult | null;
}

export default function Result({ result }: Props) {
    if (result === null) {
        return (
            <Typography variant="body2" color="text.secondary">
                Try your luck.
            </Typography>
        );
    }

    return (
        <Typography variant="h5" color={result.won ? "success.main" : "error.main"}>
            {result.won ? "+" : "-"}{Math.abs(result.delta).toLocaleString()} {CURRENCY_TICKER}
        </Typography>
    );
}