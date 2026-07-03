"use client";

import { useState } from "react";
import { Typography, Box } from "@mui/material";
import { CURRENCY_TICKER } from "@/lib/config";

interface Result {
    won: boolean;
    delta: number;
}

interface Props {
    result: Result | null;
    amountValid: boolean;
    isLocked: boolean;
}

interface SessionEntry {
    won: boolean;
    signed: number;
}

function resolveStreak(history: SessionEntry[]): { count: number; won: boolean } | null {
    if (history.length < 2) return null;
    const latest = history[history.length - 1];
    let count = 1;
    for (let index = history.length - 2; index >= 0; index--) {
        if (history[index].won !== latest.won) break;
        count++;
    }
    if (count < 2) return null;
    return { count, won: latest.won };
}

export default function GameStatusDisplay({ result, amountValid, isLocked }: Props) {
    const [history, setHistory] = useState<SessionEntry[]>([]);
    const [lastResult, setLastResult] = useState<Result | null>(null);

    if (result !== null && result !== lastResult) {
        setLastResult(result);
        const signed = result.won ? result.delta : -result.delta;
        setHistory((prev) => [...prev, { won: result.won, signed }]);
    }

    const totalEarned = history
        .filter((entry) => entry.won)
        .reduce((sum, entry) => sum + entry.signed, 0);

    const totalLost = history
        .filter((entry) => !entry.won)
        .reduce((sum, entry) => sum + Math.abs(entry.signed), 0);

    const netProfit = totalEarned - totalLost;
    const totalWagered = totalEarned + totalLost;
    const earnPct = totalWagered === 0 ? 0 : (totalEarned / totalWagered) * 100;
    const lossPct = totalWagered === 0 ? 0 : (totalLost / totalWagered) * 100;

    const wins = history.filter((entry) => entry.won).length;
    const losses = history.filter((entry) => !entry.won).length;

    const netColor = netProfit > 0 ? "success.main" : netProfit < 0 ? "error.main" : "text.disabled";
    const netText = netProfit > 0 ? `+${netProfit.toLocaleString()}` : netProfit.toLocaleString();

    const streak = resolveStreak(history);
    const streakColor = streak === null ? "text.secondary" : streak.won ? "success.main" : "error.main";
    const streakLabel = streak !== null ? `🔥${streak.count}+` : null;

    const isInactive = isLocked || !amountValid;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography variant="h5" fontWeight="bold" color={isInactive ? "text.disabled" : netColor}>
                    {netText}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="regular">
                    {CURRENCY_TICKER}
                </Typography>
                {streakLabel !== null && (
                    <Typography variant="h6" color={streakColor}>
                        {streakLabel}
                    </Typography>
                )}
            </Box>

            <Box>
                <Box sx={{ display: "flex", height: 4, borderRadius: 999, overflow: "hidden", bgcolor: "divider" }}>
                    <Box sx={{ width: `${earnPct}%`, bgcolor: "success.main", transition: "width 0.6s ease" }} />
                    <Box sx={{ width: `${lossPct}%`, bgcolor: "error.main", transition: "width 0.6s ease" }} />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                    <Typography variant="body1" color="success.main">
                        +{totalEarned.toLocaleString()} | {wins}W
                    </Typography>
                    <Typography variant="body1" color="error.main">
                        -{totalLost.toLocaleString()} | {losses}L
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}