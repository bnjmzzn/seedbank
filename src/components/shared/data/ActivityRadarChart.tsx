"use client";

import {
    RadarChart as RechartsRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { Box, Typography } from "@mui/material";
import theme from "@/lib/client/theme";

export interface RadarSeriesPoint {
    axis: string;
    value: number;
}

interface RadarComparisonChartProps {
    data: RadarSeriesPoint[];
    isLoading?: boolean;
}

// to remove on select highlight
const noFocusOutlineSx = {
    "& *:focus": {
        outline: "none",
    },
};

interface RadarTooltipProps {
    active?: boolean;
    payload?: { payload: RadarSeriesPoint }[];
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

export default function RadarComparisonChart({ data, isLoading }: RadarComparisonChartProps) {
    if (isLoading) {
        return null;
    }

    if (data.length === 0) {
        return null;
    }

    return (
        <Box sx={{ width: "100%", height: "100%", ...noFocusOutlineSx }}>
            <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart
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
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        fill={theme.palette.primary.main}
                        fillOpacity={0.4}
                    />
                </RechartsRadarChart>
            </ResponsiveContainer>
        </Box>
    );
}