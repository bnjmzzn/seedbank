"use client";

import { useState } from "react";
import { Typography, Box, Paper } from "@mui/material";
import { CURRENCY_TICKER } from "@/lib/config";

type ResultStatus = "won" | "lost" | "invalid" | "ready" | "busy";

interface Result {
    won: boolean;
    delta: number;
}

interface Props {
    result: Result | null;
    amountValid: boolean;
    isLocked: boolean;
    readyLabel?: string;
    busyLabel?: string;
}

interface HistoryEntry {
    won: boolean;
}

function resolveStatus(result: Result | null, amountValid: boolean, isLocked: boolean): ResultStatus {
    if (!amountValid) return "invalid";
    if (isLocked) return "busy";
    if (result !== null) return result.won ? "won" : "lost";
    return "ready";
}

function resolveHelperText(status: ResultStatus, readyLabel: string, busyLabel: string): string {
    if (status === "won") return "You won! Pick again";
    if (status === "lost") return "You lost. Pick again";
    if (status === "invalid") return "Enter a valid amount";
    if (status === "busy") return busyLabel;
    return readyLabel;
}

function resolveHelperColor(status: ResultStatus): string {
    if (status === "won") return "success.main";
    if (status === "lost") return "error.main";
    if (status === "busy") return "text.disabled";
    return "text.secondary";
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

export default function GameStatusDisplay({
    result,
    amountValid,
    isLocked,
    readyLabel = "Pick your choice",
    busyLabel = "Loading",
}: Props) {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [lastResult, setLastResult] = useState<Result | null>(null);

    if (result !== null && result !== lastResult) {
        setLastResult(result);
        setHistory((prev) => [...prev, { won: result.won }]);
    }

    const displayResult = result ?? lastResult;
    const status = resolveStatus(displayResult, amountValid, isLocked);

    const wins = history.filter((entry) => entry.won).length;
    const losses = history.filter((entry) => !entry.won).length;
    const total = history.length;
    const winPct = total === 0 ? 0 : (wins / total) * 100;
    const lossPct = total === 0 ? 0 : (losses / total) * 100;

    const helperText = resolveHelperText(status, readyLabel, busyLabel);
    const helperColor = resolveHelperColor(status);
    const amountColor = resolveAmountColor(status);
    const amountText = resolveAmountText(displayResult);

    return (
        <Paper elevation={0} sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2, bgcolor: "grey.900", borderRadius: 2 }}>
            <Typography variant="subtitle2" color={helperColor}>
                {helperText}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography variant="h4" fontWeight="bold" color={amountColor}>
                    {amountText}
                </Typography>
                <Typography variant="h6" color="text.secondary" fontWeight="regular">
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
        </Paper>
    );
}