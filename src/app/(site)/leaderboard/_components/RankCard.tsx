"use client";

import { Paper, Avatar, Typography, Box, Skeleton } from "@mui/material";
import { getAvatarUrl } from "@/lib/client/utils";
import { useCountUp } from "@/lib/client/hooks/ui";

interface RankCardProps {
    username?: string;
    rank?: number;
    isLoading?: boolean;
}

const paperSx = {
    minWidth: 240,
    display: "flex",
    flex: 1,
    alignItems: "center",
    gap: 2,
    p: 2,
};

export default function RankCard({ username, rank, isLoading }: RankCardProps) {
    const animatedRank = useCountUp(rank ?? 0);

    if (isLoading || !username || !rank) {
        return (
            <Paper sx={paperSx} elevation={0}>
                <Skeleton variant="circular" width={56} height={56} sx={{ flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="70%" height={32} />
                </Box>
            </Paper>
        );
    }

    return (
        <Paper sx={paperSx} elevation={0}>
            <Avatar src={getAvatarUrl(username)} alt={username} sx={{ width: 56, height: 56, flexShrink: 0 }} />
            <Box sx={{ minWidth: 0 }}>
                <Typography color="text.secondary" noWrap>{username}</Typography>
                <Typography variant="h5" fontWeight="bold">
                    #{animatedRank.toLocaleString()}
                </Typography>
            </Box>
        </Paper>
    );
}