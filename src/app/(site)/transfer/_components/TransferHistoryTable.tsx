"use client";

import { Box, Typography } from "@mui/material";
import HistoryTable from "@/components/shared/HistoryTable";
import useUserStore from "@/store/useUserStore";

export default function TransferHistoryTable() {
    const username = useUserStore((s) => s.username);

    if (!username) return null;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, px: 4, py: 3.5 }}>
            <Typography variant="h6" fontWeight={700}>
                Transfer History
            </Typography>
            <HistoryTable username={username} type="TRANSFER" />
        </Box>
    );
}