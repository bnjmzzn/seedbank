"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { Box, Typography } from "@mui/material";
import theme from "@/lib/client/theme";

export interface LineSeriesPoint {
    index: number;
    value: number;
    timestamp: number;
}

interface LineComparisonChartProps {
    data: LineSeriesPoint[];
    isLoading?: boolean;
}

// to remove on select highlight
const noFocusOutlineSx = {
    "& *:focus": {
        outline: "none",
    },
};

interface LineTooltipProps {
    active?: boolean;
    payload?: { payload: LineSeriesPoint }[];
}

function LineTooltip({ active, payload }: LineTooltipProps) {
    if (!active || !payload?.length) {
        return null;
    }

    const point = payload[0].payload;
    const isNegative = point.value < 0;

    return (
        <Box sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            px: 1.5,
            py: 1,
        }}>
            <Typography color="text.secondary" fontFamily="monospace" variant="caption">
                {new Date(point.timestamp).toLocaleString()}
            </Typography>
            <Typography
                fontWeight="bold"
                fontFamily="monospace"
                color={isNegative ? "error.main" : "primary.main"}
            >
                {point.value.toLocaleString()}
            </Typography>
        </Box>
    );
}

export default function LineComparisonChart({ data, isLoading }: LineComparisonChartProps) {
    if (isLoading) {
        return null;
    }

    if (data.length === 0) {
        return null;
    }

    const isOverallNegative = data[data.length - 1].value < data[0].value;
    const lineColor = isOverallNegative ? theme.palette.error.main : theme.palette.primary.main;
    const gradientId = isOverallNegative ? "lineComparisonGradientNegative" : "lineComparisonGradientPositive";

    return (
        <Box sx={{ width: "100%", height: "100%", ...noFocusOutlineSx }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    accessibilityLayer={false}
                    margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={lineColor} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="index"
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        tick={false}
                        axisLine={false}
                    />
                    <YAxis tick={false} axisLine={false} width={0} domain={["auto", "auto"]} />
                    <Tooltip content={<LineTooltip />} />
                    <Area
                        type="linear"
                        dataKey="value"
                        stroke={lineColor}
                        strokeWidth={2}
                        fill={`url(#${gradientId})`}
                        dot={false}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    );
}