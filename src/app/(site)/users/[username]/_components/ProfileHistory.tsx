"use client";

import { Box, Typography } from "@mui/material";
import HistoryTable from "@/components/shared/HistoryTable";
import { useHistory } from "@/lib/client/hooks/useHistory";

interface Props {
    username: string;
}

export default function ProfileHistory({ username }: Props) {
    const { rows, isLoading, error } = useHistory(username, { limit: 10 });

    return (
        <Box
            sx={{
                borderRadius: 3,
                px: 4,
                py: 3.5,
            }}
        >
            <Typography variant="h6" fontWeight={700} mb={2}>
                Recent Activity
            </Typography>
            <HistoryTable rows={rows} isLoading={isLoading} error={error} />
        </Box>
    );
}