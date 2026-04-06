"use client";

import { Box, Typography, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useHistory } from "@/lib/client/hooks/useHistory";

const LIMIT = 20;

interface Props {
    username: string;
}

export default function BalanceLineChart({ username }: Props) {
    const { rows, isLoading } = useHistory(username, { limit: LIMIT });

    const data = [...rows].reverse();

    const gains = data.map((r) => (r.change > 0 ? r.change : null));
    const losses = data.map((r) => (r.change < 0 ? Math.abs(r.change) : null));
    const xIndices = data.map((_, i) => i);

    return (
        <Box
            sx={{
                flex: 1,
                borderRadius: 3,
                px: 4,
                py: 3.5,
                minWidth: 0,
            }}
        >
            <Typography variant="h6" fontWeight={700} mb={2}>
                Balance History
            </Typography>

            {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
                    <CircularProgress size={28} />
                </Box>
            ) : data.length === 0 ? (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
                    <Typography variant="body2" color="text.secondary">
                        No activity yet
                    </Typography>
                </Box>
            ) : (
                <BarChart
                    height={200}
                    margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    series={[
                        {
                            data: gains,
                            color: "#2ecc71",
                            label: "Gained",
                            valueFormatter: (v) => v !== null ? `+${v.toLocaleString()} seeds` : "",
                        },
                        {
                            data: losses,
                            color: "#e74c3c",
                            label: "Lost",
                            valueFormatter: (v) => v !== null ? `-${v.toLocaleString()} seeds` : "",
                        },
                    ]}
                    xAxis={[{
                        scaleType: "band",
                        data: xIndices,
                        tickLabelStyle: { display: "none" },
                        disableLine: true,
                        disableTicks: true,
                    }]}
                    yAxis={[{
                        tickLabelStyle: { display: "none" },
                        disableLine: true,
                        disableTicks: true,
                    }]}
                    axisHighlight={{ x: "none", y: "none" }}
                    slotProps={{ legend: { hidden: true } }}
                    sx={{
                        "& .MuiChartsAxis-root": { display: "none" },
                    }}
                />
            )}
        </Box>
    );
}