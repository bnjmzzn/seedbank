"use client";

import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { Box, Skeleton, Typography } from "@mui/material";
import theme from "@/lib/client/theme";

export interface RadarPoint {
    axis: string;
    value: number;
}

interface RadarChartProps {
    data: RadarPoint[];
    isLoading?: boolean;
    color?: string;
    emptyText?: string;
}

const MIN_AXES_TO_RENDER = 3;

const noFocusOutlineSx = {
    "& *:focus": {
        outline: "none",
    },
};

interface RadarTooltipProps {
    active?: boolean;
    payload?: { payload: RadarPoint }[];
}

function RadarTooltip({ active, payload }: RadarTooltipProps) {
    if (!active || !payload?.length) {
        return null;
    }

    const point = payload[0].payload;

    return (
        <Box sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            px: 1.5,
            py: 1,
        }}>
            <Typography fontWeight="bold" fontFamily="monospace">{point.axis}</Typography>
            <Typography color="text.secondary" fontFamily="monospace">{point.value.toLocaleString()}</Typography>
        </Box>
    );
}

function RadarChartSkeleton() {
    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Skeleton variant="circular" width="70%" height="70%" />
        </Box>
    );
}

interface RadarChartEmptyProps {
    text: string;
}

function RadarChartEmpty({ text }: RadarChartEmptyProps) {
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

export default function RadarChartWidget({
    data,
    isLoading,
    color = theme.palette.primary.main,
    emptyText = "Not enough data to show activity yet.",
}: RadarChartProps) {
    if (isLoading) {
        return <RadarChartSkeleton />;
    }

    if (data.length < MIN_AXES_TO_RENDER) {
        return <RadarChartEmpty text={emptyText} />;
    }

    return (
        <Box sx={{ width: "100%", height: "100%", ...noFocusOutlineSx }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                    data={data}
                    accessibilityLayer={false}
                    outerRadius="65%"
                    margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
                >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="axis" />
                    <PolarRadiusAxis tick={false} axisLine={false} />
                    <Tooltip content={<RadarTooltip />} />
                    <Radar
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        fill={color}
                        fillOpacity={0.4}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </Box>
    );
}