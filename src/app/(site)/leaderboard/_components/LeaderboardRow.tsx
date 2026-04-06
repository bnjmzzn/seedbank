"use client";

import { useRouter } from "next/navigation";
import { Box, Avatar, Typography, ButtonBase } from "@mui/material";
import { getAvatarUrl } from "@/lib/client/avatar";

interface Props {
    rank: number;
    username: string;
    balance: number;
    isYou?: boolean;
}

export default function LeaderboardRow({ rank, username, balance, isYou = false }: Props) {
    const router = useRouter();

    return (
        <ButtonBase
            onClick={() => router.push(`/users/${username}`)}
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2,
                py: 2,
                borderRadius: 2,
                bgcolor: isYou ? "primary" : "action.hover",
                textAlign: "left",
                transition: "all 150ms ease",
                "&:hover": { transform: "scale(1.01)" },
            }}
        >
            <Typography
                fontFamily="monospace"
                variant="h6"
                fontWeight={700}
                sx={{ minWidth: 32, textAlign: "center", flexShrink: 0 }}
            >
                {rank}
            </Typography>

            <Avatar
                src={getAvatarUrl(username)}
                sx={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    border: "3px solid",
                    borderColor: "background.default",
                }}
            />

            <Box sx={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 2 }}>
                <Typography fontWeight={700} noWrap sx={{ color: isYou ? "#000000" : "text.primary" }}>
                    @{username}
                </Typography>
                {isYou && (
                    <Typography
                        fontWeight={700}
                        sx={{
                            bgcolor: "#000000",
                            color: "primary",
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

            <Typography
                fontFamily="monospace"
                fontWeight={700}
                sx={{ flexShrink: 0, color: isYou ? "#000000" : "" }}
            >
                {balance.toLocaleString()} seeds
            </Typography>
        </ButtonBase>
    );
}