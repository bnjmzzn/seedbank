"use client";

import { Paper, Typography, Box, Skeleton } from "@mui/material";
import { useCountUp } from "@/lib/client/hooks/ui";

interface TotalPlayedStatProps {
    totalGames: number;
    isLoading?: boolean;
}

const paperSx = {
    minWidth: 140,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    p: 2,
};

export default function TotalPlayedStat({ totalGames, isLoading }: TotalPlayedStatProps) {
    const animatedTotalGames = useCountUp(totalGames);

    if (isLoading) {
        return (
            <Paper sx={paperSx} elevation={0}>
                <Skeleton variant="text" width="40%" height={40} />
                <Skeleton variant="text" width="80%" />
            </Paper>
        );
    }

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