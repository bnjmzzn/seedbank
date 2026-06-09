"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { CURRENCY_TICKER } from "@/lib/config";

interface GameResult {
    won: boolean;
    delta: number;
    balance: number;
}

interface Props {
    result: GameResult | null;
    onFinish: () => void;
}

export default function Visualizer({ result, onFinish }: Props) {
    const [display, setDisplay] = useState<GameResult | null>(null);
    useEffect(() => {
        if (result === null) return;
        setDisplay(result);
        const timer = setTimeout(onFinish, 1200);
        return () => clearTimeout(timer);
    }, [result]);

    if (display === null) return null;

    return (
        <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h4" color={display.won ? "success.main" : "error.main"}>
                {display.won ? "You won" : "You lost"} {Math.abs(display.delta).toLocaleString()} {CURRENCY_TICKER}
            </Typography>
        </Box>
    );
}