"use client";

import { useState } from "react";
import { Typography, Box } from "@mui/material";
import { CURRENCY_TICKER } from "@/lib/config";

type ResultStatus = "won" | "lost" | "inactive" | "ready";

interface Result {
    won: boolean;
    delta: number;
}

interface Props {
    result: Result | null;
    amountValid: boolean;
    isLocked: boolean;
}

interface HistoryEntry {
    won: boolean;
}

function resolveStatus(result: Result | null, amountValid: boolean, isLocked: boolean): ResultStatus {
    if (isLocked) return "inactive";
    if (!amountValid) return "inactive";
    if (result !== null) return result.won ? "won" : "lost";
    return "ready";
}

function resolveAmountColor(status: ResultStatus): string {
    if (status === "won") return "success.main";
    if (status === "lost") return "error.main";
    return "text.disabled";
}

function resolveAmountText(result: Result | null): string {
    if (result === null) return "0";
    if (result.won) return `+${result.delta.toLocaleString()}`;
    return `-${Math.abs(result.delta).toLocaleString()}`;
}

export default function GameStatusDisplay({ result, amountValid, isLocked }: Props) {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [lastResult, setLastResult] = useState<Result | null>(null);

    if (result !== null && result !== lastResult) {
        setLastResult(result);
        setHistory((prev) => [...prev, { won: result.won }]);
    }

    const displayResult = result ?? lastResult;
    const status = resolveStatus(displayResult, amountValid, isLocked);
    const amountColor = resolveAmountColor(status);
    const amountText = resolveAmountText(displayResult);

    const wins = history.filter((entry) => entry.won).length;
    const losses = history.filter((entry) => !entry.won).length;
    const total = history.length;
    const winPct = total === 0 ? 0 : (wins / total) * 100;
    const lossPct = total === 0 ? 0 : (losses / total) * 100;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography variant="h5" fontWeight="bold" color={amountColor}>
                    {amountText}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="regular">
                    {CURRENCY_TICKER}
                </Typography>
            </Box>

            <Box>
                <Box sx={{ display: "flex", height: 4, borderRadius: 999, overflow: "hidden", bgcolor: "divider" }}>
                    <Box sx={{ width: `${winPct}%`, bgcolor: "success.main", transition: "width 0.6s ease" }} />
                    <Box sx={{ width: `${lossPct}%`, bgcolor: "error.main", transition: "width 0.6s ease" }} />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                    <Typography variant="body2" color="success.main">{wins}W</Typography>
                    <Typography variant="body2" color="error.main">{losses}L</Typography>
                </Box>
            </Box>
        </Box>
    );
}