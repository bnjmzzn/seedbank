"use client";

import { Paper, Typography, Box } from "@mui/material";
import { HistoryRow } from "@/types/db";
import HistoryTable from "@/components/shared/HistoryTable";
import Iconify from "@/components/shared/Iconify";

interface Props {
    rows: HistoryRow[];
    isLoading?: boolean;
}

export default function HistoryFeed({ rows, isLoading }: Props) {
    return (
        <Paper elevation={0} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Iconify icon="mdi:history" sx={{ color: "text.disabled" }} />
                <Typography color="text.secondary">Activity Feed</Typography>
            </Box>
            <HistoryTable rows={rows} isLoading={isLoading} maxRowsPerPage={10} limit={5} />
        </Paper>
    );
}