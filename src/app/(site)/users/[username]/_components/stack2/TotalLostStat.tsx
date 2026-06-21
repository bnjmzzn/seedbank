"use client";

import { Paper, Typography, Box } from "@mui/material";
import { useCountUp } from "@/lib/client/hooks/ui";

interface TotalLostStatProps {
    totalLost: number;
}

const paperSx = {
    minWidth: 140,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    p: 2,
};

export default function TotalLostStat({ totalLost }: TotalLostStatProps) {
    const animatedTotalLost = useCountUp(totalLost);

    return (
        <Paper sx={paperSx} elevation={0}>
            <Typography variant="h4" fontWeight="bold" color="error.main">
                -{animatedTotalLost.toLocaleString()}
            </Typography>
            <Box>
                <Typography color="text.secondary">Total Lost</Typography>
            </Box>
        </Paper>
    );
}