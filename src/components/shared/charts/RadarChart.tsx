"use client";

import {
    RadarChart as RechartsRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
} from "recharts";

export interface RadarSeriesPoint {
    axis: string;
    value: number;
}

interface RadarComparisonChartProps {
    data: RadarSeriesPoint[];
    isLoading?: boolean;
}

export default function RadarComparisonChart({ data, isLoading }: RadarComparisonChartProps) {
    if (isLoading) {
        return null;
    }

    if (data.length === 0) {
        return null;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="axis" />
                <PolarRadiusAxis />
                <Radar dataKey="value" />
            </RechartsRadarChart>
        </ResponsiveContainer>
    );
}