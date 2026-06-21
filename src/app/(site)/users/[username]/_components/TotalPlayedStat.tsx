"use client";

import { Paper, Typography, Box } from "@mui/material";
import { useCountUp } from "@/lib/client/hooks/ui";

interface TotalPlayedStatProps {
    totalGames: number;
}

const paperSx = {
    minWidth: 140,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    p: 2,
};

export default function TotalPlayedStat({ totalGames }: TotalPlayedStatProps) {
    const animatedTotalGames = useCountUp(totalGames);

    return (
        <Paper sx={paperSx} elevation={0}>
            <Typography variant="h4" fontWeight="bold">
                {animatedTotalGames.toLocaleString()}
            </Typography>
            <Box>
                <Typography color="text.secondary">Total Games Played</Typography>
            </Box>
        </Paper>
    );
}