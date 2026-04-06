"use client";

import { Box, Avatar, Typography, Skeleton } from "@mui/material";
import { CalendarToday as CalendarIcon } from "@mui/icons-material";
import { useProfile } from "@/lib/client/hooks/useProfile";
import { getAvatarUrl } from "@/lib/client/avatar";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

interface Props {
    username: string;
}

export default function ProfileCard({ username }: Props) {
    const { profile, isLoading } = useProfile(username);

    return (
        <Box
            sx={{
                flex: 1,
                bgcolor: "primary.main",
                borderRadius: 3,
                px: 4,
                py: 3.5,
                display: "flex",
                alignItems: "center",
                gap: 3,
                minWidth: 0,
            }}
        >
            {isLoading ? (
                <Skeleton variant="circular" width={72} height={72} sx={{ flexShrink: 0, bgcolor: "rgba(0,0,0,0.15)" }} />
            ) : (
                <Avatar
                    src={getAvatarUrl(username)}
                    sx={{
                        width: 72,
                        height: 72,
                        flexShrink: 0,
                        border: "4px solid",
                        borderColor: "#121212",
                    }}
                />
            )}
            <Box sx={{ minWidth: 0 }}>
                {isLoading ? (
                    <>
                        <Skeleton variant="text" width={140} height={36} sx={{ bgcolor: "rgba(0,0,0,0.15)" }} />
                        <Skeleton variant="text" width={110} height={22} sx={{ bgcolor: "rgba(0,0,0,0.15)" }} />
                    </>
                ) : (
                    <>
                        <Typography variant="h5" fontWeight={800} color="common.black" noWrap>
                            @{profile?.username}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                            <CalendarIcon sx={{ fontSize: 14, color: "common.black" }} />
                            <Typography variant="body2" color="common.black" fontWeight={500}>
                                {profile?.created_at ? formatDate(profile.created_at) : "—"}
                            </Typography>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}