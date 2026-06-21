"use client";

import { Paper, Typography, Box } from "@mui/material";
import { useCountUp } from "@/lib/client/hooks/ui";

interface TotalProfitStatProps {
    totalProfit: number;
}

const paperSx = {
    minWidth: 140,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    p: 2,
};

export default function TotalProfitStat({ totalProfit }: TotalProfitStatProps) {
    const animatedTotalProfit = useCountUp(totalProfit);

    return (
        <Paper sx={paperSx} elevation={0}>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
                +{animatedTotalProfit.toLocaleString()}
            </Typography>
            <Box>
                <Typography color="text.secondary">Total Profit</Typography>
            </Box>
        </Paper>
    );
}