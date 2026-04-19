"use client";

import { useState, useEffect, useCallback } from "react";
import { Paper, Typography, Box, Button, Skeleton } from "@mui/material";
import { api } from "@/lib/client/api";
import { CURRENCY_TICKER, DAILY_AMOUNT } from "@/lib/config";
import { showSnackbar } from "@/components/shared/SnackBar";

interface DailyStatus {
    claimable: boolean;
    remaining: number | null;
}

interface Props {
    daily: DailyStatus | null;
    isLoading?: boolean;
    onClaimed?: () => void;
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

function formatCountdown(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
}

const paperSx = {
    minWidth: 300,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
};

export default function DailyCard({ daily, isLoading, onClaimed }: Props) {
    const [remaining, setRemaining] = useState<number | null>(daily?.remaining ?? null);
    const [claiming, setClaiming] = useState(false);

    useEffect(() => {
        setRemaining(daily?.remaining ?? null);
    }, [daily?.remaining]);

    useEffect(() => {
        const notCoolingDown = remaining === null || remaining <= 0;
        if (notCoolingDown) return;

        const interval = setInterval(() => {
            setRemaining(prev => {
                const expired = prev === null || prev <= 1000;
                if (expired) {
                    clearInterval(interval);
                    onClaimed?.();
                    return null;
                }
                return prev - 1000;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [remaining, onClaimed]);

    const handleClaim = useCallback(async () => {
        setClaiming(true);
        try {
            const res = await api.user.daily.claim();
            onClaimed?.();
            showSnackbar(`You claimed ${res.data.data.claimed.toLocaleString()} ${CURRENCY_TICKER}!`, "success");
        } finally {
            setClaiming(false);
        }
    }, [onClaimed]);

    const elapsed = remaining !== null ? TWENTY_FOUR_HOURS - remaining : TWENTY_FOUR_HOURS;
    const elapsedPct = Math.min((elapsed / TWENTY_FOUR_HOURS) * 100, 100);
    const progressColor = daily?.claimable ? "success.main" : "primary.main";
    const bottomLeftText = daily?.claimable ? "Ready to claim" : "Come back later";
    const countdownText = remaining !== null ? formatCountdown(remaining) : "00:00:00";
    const isClaimable = daily?.claimable ?? false;

    if (isLoading) {
        return (
            <Paper sx={paperSx} elevation={0}>
                <Box>
                    <Skeleton variant="rounded" width={160} height={42} />
                </Box>
                <Box>
                    <Skeleton variant="rounded" height={4} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                        <Skeleton variant="text" width={80} />
                        <Skeleton variant="text" width={60} />
                    </Box>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper sx={paperSx} elevation={0}>
            <Box>
                {isClaimable && (
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleClaim}
                        loading={claiming}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                        Claim Daily
                    </Button>
                )}

                {!isClaimable && (
                    <Typography variant="h4" fontWeight={700} sx={{ fontVariantNumeric: "tabular-nums" }}>
                        {countdownText}
                    </Typography>
                )}
            </Box>

            <Box>
                <Box sx={{ display: "flex", height: 4, borderRadius: 999, overflow: "hidden", bgcolor: "divider" }}>
                    <Box sx={{ width: `${elapsedPct}%`, bgcolor: progressColor, transition: "width 0.6s ease" }} />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                    <Typography color="text.secondary">{bottomLeftText}</Typography>
                    <Typography color="text.secondary">{DAILY_AMOUNT.toLocaleString()} {CURRENCY_TICKER}</Typography>
                </Box>
            </Box>
        </Paper>
    );
}