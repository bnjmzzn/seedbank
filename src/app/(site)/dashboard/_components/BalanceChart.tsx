"use client";

import { useMemo } from "react";
import { Box, Paper, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import type { HistoryRow } from "@/types/db";
import type { BalancePoint } from "@/lib/client/utils";
import { buildBalanceTimeline } from "@/lib/client/utils";
import Iconify from "@/components/shared/Iconify";

interface Props {
    balance: number;
    rows: HistoryRow[];
    isLoading?: boolean;
    maxBins?: number;
}

interface TooltipProps {
    active?: boolean;
    payload?: { payload: BalancePoint }[];
}

function ChartTooltip({ active, payload }: TooltipProps) {
    if (!active || !payload?.length) return null;

    const point = payload[0].payload;
    const isPositive = point.change > 0;
    const changeStr = isPositive
        ? `+${point.change.toLocaleString()}`
        : point.change.toLocaleString();

    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                px: 1.5,
                py: 1,
            }}
        >
            <Typography variant="caption" color="text.secondary" display="block">
                {new Date(point.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </Typography>
            <Typography fontWeight={700} sx={{ fontFamily: "monospace" }}>
                {point.balanceAfter.toLocaleString()}
            </Typography>
            <Typography
                variant="caption"
                fontWeight={600}
                sx={{ fontFamily: "monospace", color: isPositive ? "success.main" : "error.main" }}
            >
                {changeStr}
            </Typography>
        </Box>
    );
}

export default function BalanceChart({ balance, rows, isLoading, maxBins = 10 }: Props) {
    const theme = useTheme();

    const data = useMemo(
        () => buildBalanceTimeline(rows, balance).slice(-maxBins),
        [rows, balance, maxBins]
    );

    const isEmpty = !isLoading && data.length === 0;

    return (
        <Paper
            elevation={0}
            sx={{
                flex: 1,
                minWidth: 300,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
            }}
        >
            {isLoading && <Skeleton variant="rounded" sx={{ flex: 1, minHeight: 140 }} />}

            {isEmpty && (
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography color="text.secondary">No history yet.</Typography>
                </Box>
            )}

            {!isLoading && !isEmpty && (
                <Box sx={{ flex: 1, minHeight: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barCategoryGap="20%">
                            <XAxis dataKey="date" hide />
                            <YAxis hide domain={["auto", "auto"]} />
                            <ReferenceLine y={0} stroke={theme.palette.divider} />
                            <Tooltip
                                content={<ChartTooltip />}
                                cursor={{ fill: theme.palette.action.hover }}
                            />
                            <Bar dataKey="change" radius={[2, 2, 0, 0]}>
                                {data.map((point, i) => (
                                    <Cell
                                        key={i}
                                        fill={
                                            point.change > 0
                                                ? theme.palette.success.main
                                                : theme.palette.error.main
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Paper>
    );
}