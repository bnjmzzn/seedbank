"use client";

import { Box, Paper, Skeleton, Typography } from "@mui/material";
import { HistoryRow } from "@/types/db";

interface ReasonStat {
    reason: string;
    totalProfit: number;
    totalLost: number;
    ratio: number | null;
    count: number;
}

function buildReasonStats(rows: HistoryRow[]): ReasonStat[] {
    const groups = new Map<string, HistoryRow[]>();

    for (const row of rows) {
        const existing = groups.get(row.reason) ?? [];
        existing.push(row);
        groups.set(row.reason, existing);
    }

    const stats = Array.from(groups.entries()).map(([reason, reasonRows]) => {
        const totalProfit = reasonRows
            .filter((row) => row.change > 0)
            .reduce((sum, row) => sum + row.change, 0);

        const totalLost = reasonRows
            .filter((row) => row.change < 0)
            .reduce((sum, row) => sum + Math.abs(row.change), 0);

        const ratio = totalLost === 0 ? null : totalProfit / totalLost;

        return {
            reason,
            totalProfit,
            totalLost,
            ratio,
            count: reasonRows.length,
        };
    });

    return stats.sort((a, b) => b.count - a.count);
}

function formatRatio(ratio: number | null): string {
    if (ratio === null) {
        return "—";
    }

    return `${ratio.toFixed(2)}x`;
}

interface ReasonStatRowProps {
    stat: ReasonStat;
}

function ReasonStatRow({ stat }: ReasonStatRowProps) {
    return (
        <Paper
            elevation={1}
            sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                borderRadius: 2,
                px: 2,
                py: 1.5,
                gap: { xs: 1, sm: 2 },
            }}
        >
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap fontWeight="bold">{stat.reason}</Typography>
                <Typography noWrap variant="body2" color="text.secondary">
                    {stat.count.toLocaleString()} entries
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: { xs: "space-between", sm: "flex-end" },
                    gap: { xs: 1, sm: 2 },
                }}
            >
                <Box sx={{ textAlign: "right", minWidth: 70 }}>
                    <Typography color="text.secondary" display="block">Profit</Typography>
                    <Typography fontFamily="monospace" fontWeight="bold" color="success.main">
                        +{stat.totalProfit.toLocaleString()}
                    </Typography>
                </Box>

                <Box sx={{ textAlign: "right", minWidth: 70 }}>
                    <Typography color="text.secondary" display="block">Lost</Typography>
                    <Typography fontFamily="monospace" fontWeight="bold" color="error.main">
                        -{stat.totalLost.toLocaleString()}
                    </Typography>
                </Box>

                <Box sx={{ textAlign: "right", minWidth: 60 }}>
                    <Typography color="text.secondary" display="block">Ratio</Typography>
                    <Typography fontFamily="monospace" fontWeight="bold">{formatRatio(stat.ratio)}</Typography>
                </Box>
            </Box>
        </Paper>
    );
}

function ReasonStatSkeleton() {
    return (
        <Paper
            elevation={1}
            sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                borderRadius: 2,
                px: 2,
                py: 1.5,
                gap: { xs: 1, sm: 2 },
            }}
        >
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="25%" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: { xs: "space-between", sm: "flex-end" }, gap: { xs: 1, sm: 2 } }}>
                <Skeleton variant="text" width={60} />
                <Skeleton variant="text" width={60} />
                <Skeleton variant="text" width={50} />
            </Box>
        </Paper>
    );
}

interface StatsBreakdownProps {
    rows: HistoryRow[];
    isLoading?: boolean;
}

export default function StatsBreakdown({ rows, isLoading }: StatsBreakdownProps) {
    const stats = buildReasonStats(rows);
    const isEmpty = !isLoading && stats.length === 0;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {isLoading && (
                Array.from({ length: 4 }).map((_, i) => <ReasonStatSkeleton key={i} />)
            )}
            {isEmpty && (
                <Box sx={{ flex: 1, minHeight: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography color="text.secondary">No history yet.</Typography>
                </Box>
            )}
            {!isLoading && !isEmpty && (
                stats.map((stat) => <ReasonStatRow key={stat.reason} stat={stat} />)
            )}
        </Box>
    );
}