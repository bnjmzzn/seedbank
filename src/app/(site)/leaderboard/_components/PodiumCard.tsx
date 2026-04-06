"use client";

import { useRouter } from "next/navigation";
import { Box, Avatar, Typography, ButtonBase } from "@mui/material";
import { getAvatarUrl } from "@/lib/client/avatar";

const PODIUM_BG: Record<1 | 2 | 3, string> = {
    1: "#FFE066",
    2: "#C8E6FF",
    3: "#FFD0B5",
};

interface Props {
    rank: 1 | 2 | 3;
    username: string;
    balance: number;
    isYou?: boolean;
}

export default function PodiumCard({ rank, username, balance, isYou = false }: Props) {
    const router = useRouter();
    const bg = PODIUM_BG[rank];

    return (
        <ButtonBase
            onClick={() => router.push(`/users/${username}`)}
            sx={{
                flex: 1,
                borderRadius: 2,
                overflow: "hidden",
                display: "block",
                textAlign: "left",
                transition: "all 150ms ease",
                "&:hover": { transform: "scale(1.01)" },
            }}
        >
            <Box
                sx={{
                    bgcolor: bg,
                    px: 2,
                    py: rank === 1 ? 4 : 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Typography variant="h6" fontWeight={700} sx={{ color: "background.default" }}>
                    #{rank}
                </Typography>

                <Avatar
                    src={getAvatarUrl(username)}
                    sx={{
                        width: rank === 1 ? 64 : 48,
                        height: rank === 1 ? 64 : 48,
                        border: "3px solid",
                        borderColor: "background.default",
                    }}
                />

                <Box sx={{ textAlign: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        <Typography fontWeight={700} noWrap sx={{ color: "background.default" }}>
                            @{username}
                        </Typography>
                        {isYou && (
                            <Typography
                                fontWeight={700}
                                sx={{
                                    bgcolor: "background.default",
                                    color: bg,
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    flexShrink: 0,
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.06em",
                                }}
                            >
                                you
                            </Typography>
                        )}
                    </Box>
                    <Typography fontFamily="monospace" fontWeight={700} sx={{ color: "background.default" }}>
                        {balance.toLocaleString()}
                    </Typography>
                </Box>
            </Box>
        </ButtonBase>
    );
}