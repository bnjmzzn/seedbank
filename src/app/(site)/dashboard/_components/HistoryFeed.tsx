"use client";

import { Paper } from "@mui/material";
import type { HistoryRow } from "@/types/db";
import HistoryTable from "@/components/shared/HistoryTable";

interface Props {
    rows: HistoryRow[];
    isLoading?: boolean;
}

export default function HistoryFeed({ rows, isLoading }: Props) {
    return (
        <Paper elevation={0} sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
            <HistoryTable rows={rows} isLoading={isLoading} maxRowsPerPage={10} limit={5} />
        </Paper>
    );
}