"use client";

import { useRouter } from "next/navigation";
import { Box, Avatar, Typography, ButtonBase } from "@mui/material";
import { getAvatarUrl } from "@/lib/client/avatar";

interface Props {
    rank: number | null;
    username: string;
    balance: number;
}

export default function UserRankCard({ rank, username, balance }: Props) {
    const router = useRouter();

    return (
        <ButtonBase
            onClick={() => router.push(`/users/${username}`)}
            sx={{
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
                display: "block",
                textAlign: "left",
                transition: "all 150ms ease",
                "&:hover": { transform: "scale(1.01)" },
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 3, py: 2, bgcolor: "primary.light" }}>
                <Typography variant="h4" fontWeight={700} sx={{ minWidth: 64, flexShrink: 0, color: "background.default" }}>
                    {rank ? `#${rank}` : "—"}
                </Typography>

                <Avatar
                    src={getAvatarUrl(username)}
                    sx={{ width: 48, height: 48, flexShrink: 0, border: "3px solid", borderColor: "background.default" }}
                />

                <Box sx={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h6" fontWeight={700} noWrap sx={{ color: "background.default" }}>
                        @{username}
                    </Typography>
                    <Typography
                        fontWeight={700}
                        sx={{
                            bgcolor: "background.default",
                            color: "primary.light",
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
                </Box>

                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                    <Typography variant="h6" fontWeight={700} fontFamily="monospace" sx={{ color: "background.default" }}>
                        {balance.toLocaleString()}
                    </Typography>
                    <Typography fontWeight={700} sx={{ color: "background.default"}}>
                        seeds
                    </Typography>
                </Box>
            </Box>
        </ButtonBase>
    );
}