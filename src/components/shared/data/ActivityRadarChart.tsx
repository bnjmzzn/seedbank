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

export interface ActivityRadarPoint {
    axis: string;
    value: number;
}

interface ActivityRadarChartProps {
    data: ActivityRadarPoint[];
    isLoading?: boolean;
}

const MIN_AXES_TO_RENDER = 3;

const noFocusOutlineSx = {
    "& *:focus": {
        outline: "none",
    },
};

interface ActivityRadarTooltipProps {
    active?: boolean;
    payload?: { payload: ActivityRadarPoint }[];
}

function ActivityRadarTooltip({ active, payload }: ActivityRadarTooltipProps) {
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

function ActivityRadarSkeleton() {
    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Skeleton variant="circular" width="70%" height="70%" />
        </Box>
    );
}

function ActivityRadarEmpty() {
    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Typography color="text.secondary" variant="body2">
                Not enough data to show activity yet.
            </Typography>
        </Box>
    );
}

export default function ActivityRadarChart({ data, isLoading }: ActivityRadarChartProps) {
    if (isLoading) {
        return <ActivityRadarSkeleton />;
    }

    if (data.length < MIN_AXES_TO_RENDER) {
        return <ActivityRadarEmpty />;
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
                    <Tooltip content={<ActivityRadarTooltip />} />
                    <Radar
                        dataKey="value"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        fill={theme.palette.primary.main}
                        fillOpacity={0.4}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </Box>
    );
}