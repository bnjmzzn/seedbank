"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { Box, Skeleton, Typography } from "@mui/material";
import theme from "@/lib/client/theme";

export interface TrendPoint {
    index: number;
    value: number;
    timestamp: number;
}

interface TrendChartProps {
    data: TrendPoint[];
    isLoading?: boolean;
    emptyText?: string;
}

const MIN_POINTS_TO_RENDER = 5;

const noFocusOutlineSx = {
    "& *:focus": {
        outline: "none",
    },
};

interface TrendTooltipProps {
    active?: boolean;
    payload?: { payload: TrendPoint }[];
}

function TrendTooltip({ active, payload }: TrendTooltipProps) {
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

function TrendChartSkeleton() {
    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end", gap: 0.5, p: 2 }}>
            {Array.from({ length: 24 }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="rectangular"
                    width="100%"
                    height={`${30 + Math.abs(Math.sin(i / 2)) * 60}%`}
                    sx={{ borderRadius: 0.5 }}
                />
            ))}
        </Box>
    );
}

interface TrendChartEmptyProps {
    text: string;
}

function TrendChartEmpty({ text }: TrendChartEmptyProps) {
    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Typography color="text.secondary" variant="body2">
                {text}
            </Typography>
        </Box>
    );
}

export default function TrendChartWidget({
    data,
    isLoading,
    emptyText = "Not enough data to show a trend yet.",
}: TrendChartProps) {
    if (isLoading) {
        return <TrendChartSkeleton />;
    }

    if (data.length < MIN_POINTS_TO_RENDER) {
        return <TrendChartEmpty text={emptyText} />;
    }

    const isOverallNegative = data[data.length - 1].value < data[0].value;
    const lineColor = isOverallNegative ? theme.palette.error.main : theme.palette.primary.main;
    const gradientId = isOverallNegative ? "trendGradientNegative" : "trendGradientPositive";

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
                    <ReferenceLine y={0} stroke={theme.palette.divider} strokeWidth={1} />
                    <Tooltip content={<TrendTooltip />} />
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