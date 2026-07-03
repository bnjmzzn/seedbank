"use client";

import { Paper, Avatar, Typography, Box, Skeleton } from "@mui/material";
import { getAvatarUrl } from "@/lib/client/utils";

interface ProfileCardProps {
    username?: string;
    createdAt?: string;
    isLoading?: boolean;
}

const paperSx = {
    minWidth: 300,
    display: "flex",
    flex: 1,
    alignItems: "center",
    gap: 2,
};

function formatJoinDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export default function ProfileCard({ username, createdAt, isLoading }: ProfileCardProps) {
    if (isLoading) {
        return (
            <Paper sx={paperSx} elevation={0}>
                <Skeleton variant="circular" width={56} height={56} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="70%" />
                </Box>
            </Paper>
        );
    }

    const avatarUrl = getAvatarUrl(username ?? null);
    const joinedText = createdAt ? formatJoinDate(createdAt) : "";

    return (
        <Paper sx={paperSx} elevation={0}>
            <Avatar src={avatarUrl} alt={username} sx={{ width: 56, height: 56 }} />
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="h4" fontWeight="bold" noWrap>
                    {username}
                </Typography>
                <Typography color="text.secondary">
                    Joined {joinedText}
                </Typography>
            </Box>
        </Paper>
    );
}