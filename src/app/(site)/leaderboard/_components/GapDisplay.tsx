"use client";

import { Paper, Box, Skeleton, Typography } from "@mui/material";
import { useCountUp } from "@/lib/client/hooks/ui";
import { CURRENCY_TICKER } from "@/lib/config";
import type { LeaderboardEntry } from "@/types/models";

interface GapDisplayProps {
    userRank?: number;
    userBalance?: number;
    topEntries: LeaderboardEntry[];
    isLoading?: boolean;
}

const paperSx = {
    minWidth: 240,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    p: 2,
};

function resolveComparisonEntry(userRank: number, topEntries: LeaderboardEntry[]): LeaderboardEntry | undefined {
    const isTopRank = userRank === 1;
    return isTopRank ? topEntries[1] : topEntries[0];
}

export default function GapDisplay({ userRank, userBalance, topEntries, isLoading }: GapDisplayProps) {
    const comparisonEntry = userRank !== undefined ? resolveComparisonEntry(userRank, topEntries) : undefined;
    const gap = comparisonEntry && userBalance !== undefined ? Math.abs(userBalance - comparisonEntry.balance) : 0;
    const animatedGap = useCountUp(gap);

    if (isLoading || userRank === undefined || userBalance === undefined) {
        return (
            <Paper sx={paperSx} elevation={0}>
                <Skeleton variant="text" width="40%" height={40} />
                <Skeleton variant="text" width="80%" />
            </Paper>
        );
    }

    if (!comparisonEntry) {
        return (
            <Paper sx={paperSx} elevation={0}>
                <Typography color="text.secondary">Not enough players yet.</Typography>
            </Paper>
        );
    }

    const isTopRank = userRank === 1;
    const valueColor = isTopRank ? "primary.main" : "error.main";
    const label = isTopRank ? "Ahead of #2" : "Behind #1";
    const sign = isTopRank ? "+" : "-";

    return (
        <Paper sx={paperSx} elevation={0}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: valueColor }}>
                {sign}{animatedGap.toLocaleString()} {CURRENCY_TICKER}
            </Typography>
            <Box>
                <Typography color="text.secondary">{label}</Typography>
            </Box>
        </Paper>
    );
}