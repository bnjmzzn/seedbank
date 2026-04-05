"use client";

import {
    Box,
    Avatar,
    Typography,
    Skeleton,
    Alert,
    type SxProps,
    type Theme,
} from "@mui/material";
import {
    EmojiEvents as RankIcon,
    Savings as BalanceIcon,
    CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useProfile } from "@/lib/client/hooks/useProfile";
import { getAvatarUrl } from "@/lib/client/avatar";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function IconBadge({ children }: { children: React.ReactNode }) {
    return (
        <Box
            sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}
        >
            {children}
        </Box>
    );
}

function StatRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconBadge>{icon}</IconBadge>
            <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {label}
                </Typography>
                <Typography variant="h6" fontWeight={800} fontFamily="monospace">
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}

function StatRowSkeleton() {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Skeleton variant="rounded" width={48} height={48} />
            <Box>
                <Skeleton variant="text" width={50} height={20} />
                <Skeleton variant="text" width={90} height={32} />
            </Box>
        </Box>
    );
}

interface ProfileHeaderProps {
    username: string;
    sx?: SxProps<Theme>;
}

export default function ProfileHeader({ username, sx }: ProfileHeaderProps) {
    const { profile, isLoading, error } = useProfile(username);

    if (error) {
        return (
            <Alert severity="error" sx={{ borderRadius: 2, ...sx }}>
                Failed to load profile.
            </Alert>
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 3,
                ...sx,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    bgcolor: "primary.main",
                    borderRadius: 3,
                    px: 4,
                    py: 3.5,
                    flex: 1,
                    minWidth: 0,
                }}
            >
                {isLoading ? (
                    <Skeleton variant="circular" width={72} height={72} sx={{ flexShrink: 0 }} />
                ) : (
                    <Avatar
                        src={getAvatarUrl(username)}
                        sx={{
                            width: 72,
                            height: 72,
                            flexShrink: 0,
                            border: "5px solid",
                            borderColor: "background.default",
                        }}
                    />
                )}

                <Box sx={{ minWidth: 0 }}>
                    {isLoading ? (
                        <>
                            <Skeleton variant="text" width={140} height={36} sx={{ bgcolor: "rgba(0,0,0,0.15)" }} />
                            <Skeleton variant="text" width={100} height={22} sx={{ bgcolor: "rgba(0,0,0,0.15)" }} />
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
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    flex: 1,
                    px: 2,
                }}
            >
                {isLoading ? (
                    <>
                        <StatRowSkeleton />
                        <StatRowSkeleton />
                    </>
                ) : (
                    <>
                        <StatRow
                            icon={<RankIcon sx={{ color: "common.black", fontSize: 24 }} />}
                            label="Rank"
                            value={`#${profile?.rank}`}
                        />
                        <StatRow
                            icon={<BalanceIcon sx={{ color: "common.black", fontSize: 24 }} />}
                            label="Balance"
                            value={`${profile?.balance?.toLocaleString() ?? 0} seeds`}
                        />
                    </>
                )}
            </Box>
        </Box>
    );
}