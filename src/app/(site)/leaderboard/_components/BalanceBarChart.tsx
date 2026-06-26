"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Box, Skeleton, Typography } from "@mui/material";
import theme from "@/lib/client/theme";
import { CURRENCY_TICKER } from "@/lib/config";
import type { LeaderboardEntry } from "@/types/models";

interface BalanceBarChartProps {
    entries: LeaderboardEntry[];
    isLoading?: boolean;
}

const noFocusOutlineSx = {
    "& *:focus": {
        outline: "none",
    },
};

interface BalanceTooltipProps {
    active?: boolean;
    payload?: { payload: LeaderboardEntry }[];
}

function BalanceTooltip({ active, payload }: BalanceTooltipProps) {
    if (!active || !payload?.length) {
        return null;
    }

    const entry = payload[0].payload;

    return (
        <Box sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            px: 1.5,
            py: 1,
        }}>
            <Typography fontWeight="bold">{entry.username}</Typography>
            <Typography fontFamily="monospace" color="primary.main">
                {entry.balance.toLocaleString()} {CURRENCY_TICKER}
            </Typography>
        </Box>
    );
}

function BalanceBarChartSkeleton() {
    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
            {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="rectangular"
                    height="100%"
                    width={`${90 - i * 6}%`}
                    sx={{ borderRadius: 0.5, flex: 1 }}
                />
            ))}
        </Box>
    );
}

export default function BalanceBarChart({ entries, isLoading }: BalanceBarChartProps) {
    if (isLoading) {
        return <BalanceBarChartSkeleton />;
    }

    return (
        <Box sx={{ width: "100%", height: "100%", ...noFocusOutlineSx }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={entries}
                    layout="vertical"
                    accessibilityLayer={false}
                    margin={{ top: 10, right: 24, bottom: 10, left: 10 }}
                >
                    <XAxis type="number" tick={false} axisLine={false} />
                    <YAxis
                        dataKey="rank"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        width={24}
                        tick={{
                            fill: theme.palette.text.secondary,
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            fontSize: 13,
                        }}
                    />
                    <Tooltip content={<BalanceTooltip />} cursor={{ fill: theme.palette.action.hover }} />
                    <Bar
                        dataKey="balance"
                        fill={theme.palette.primary.main}
                        radius={[0, 4, 4, 0]}
                        isAnimationActive={false}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}