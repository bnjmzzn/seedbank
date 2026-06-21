"use client";

import { Paper, Typography, Box } from "@mui/material";
import Iconify from "@/components/shared/generic/Iconify";

interface RankStatProps {
    rank?: number;
}

const paperSx = {
    minWidth: 140,
    display: "flex",
    flex: 1,
    alignItems: "center",
    gap: 2,
    p: 2,
};

export default function RankStat({ rank }: RankStatProps) {
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
                <Iconify icon="material-symbols:trophy" sx={{ color: "primary.contrastText" }} />
            </Box>
            <Box>
                <Typography color="text.secondary">Rank</Typography>
                <Typography variant="h5" fontWeight="bold">
                    {rank !== undefined ? rank.toLocaleString() : "-"}
                </Typography>
            </Box>
        </Paper>
    );
}