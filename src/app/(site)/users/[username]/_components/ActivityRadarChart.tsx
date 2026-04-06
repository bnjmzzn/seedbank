"use client";

import { Box, Typography, CircularProgress } from "@mui/material";
import { RadarChart } from "@mui/x-charts/RadarChart";
import { useHistory } from "@/lib/client/hooks/useHistory";

const REASON_LABELS: Record<string, string> = {
    DAILY: "Daily",
    "TRANSFER:SENT": "Sent",
    "TRANSFER:RECEIVED": "Received",
    "STEAL:ROBBER": "Robbed",
    "STEAL:VICTIM": "Victim",
    "GAME:COINFLIP": "Coinflip",
    "GAME:DICE": "Dice",
    "GAME:COLOR": "Color",
    "GAME:BOMB": "Bomb",
    "GAME:RACE": "Race",
};

interface Props {
    username: string;
}

export default function ActivityRadarChart({ username }: Props) {
    const { rows, isLoading } = useHistory(username, { limit: 100 });

    const { metrics, series } = (() => {
        const counts: Record<string, number> = {};
        for (const row of rows) {
            counts[row.reason] = (counts[row.reason] ?? 0) + 1;
        }

        const sorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const max = sorted[0]?.[1] ?? 1;

        const metrics = sorted.map(([reason]) => REASON_LABELS[reason] ?? reason);
        const data = sorted.map(([, count]) => Math.round((count / max) * 100));

        return { metrics, series: [{ data, label: "Activity" }] };
    })();

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
                Top Activity
            </Typography>

            {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
                    <CircularProgress size={28} />
                </Box>
            ) : metrics.length === 0 ? (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
                    <Typography variant="body2" color="text.secondary">
                        No activity yet
                    </Typography>
                </Box>
            ) : (
                <RadarChart
                    height={220}
                    series={series}
                    radar={{ metrics }}
                />
            )}
        </Box>
    );
}