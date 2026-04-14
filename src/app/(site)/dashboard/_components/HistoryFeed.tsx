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
        <Paper elevation={0} sx={{ display: "flex", flex: 1, flexDirection: "column", gap: 1.5 }}>
            <HistoryTable rows={rows} isLoading={isLoading} maxRowsPerPage={10} limit={5} />
        </Paper>
    );
}