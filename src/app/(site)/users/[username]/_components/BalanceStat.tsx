"use client";

import { Paper, Typography, Box } from "@mui/material";
import Iconify from "@/components/shared/generic/Iconify";

interface BalanceStatProps {
    balance?: number;
}

const paperSx = {
    minWidth: 140,
    display: "flex",
    flex: 1,
    alignItems: "center",
    gap: 2,
    p: 2,
};

export default function BalanceStat({ balance }: BalanceStatProps) {
    return (
        <Paper sx={paperSx} elevation={0}>
            <Box sx={{
                bgcolor: "primary.main",
                borderRadius: 1.5,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}>
                <Iconify icon="mdi:wallet" sx={{ color: "primary.contrastText" }} />
            </Box>
            <Box>
                <Typography color="text.secondary">Balance</Typography>
                <Typography variant="h5" fontWeight="bold">
                    {balance !== undefined ? balance.toLocaleString() : "-"}
                </Typography>
            </Box>
        </Paper>
    );
}