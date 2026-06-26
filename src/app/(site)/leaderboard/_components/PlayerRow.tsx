"use client";

import { Avatar, Paper, Stack, Typography } from "@mui/material";
import { getAvatarUrl } from "@/lib/client/utils";

interface PlayerRowProps {
    rank: number;
    username: string;
    balance: number;
    colorToken?: "warning" | "primary" | "error" | "default";
    size?: "regular" | "large";
}

function resolveRankColor(colorToken: PlayerRowProps["colorToken"]) {
    if (colorToken === "warning") return "warning.main";
    if (colorToken === "primary") return "primary.main";
    if (colorToken === "error") return "error.main";
    return "text.secondary";
}

export default function PlayerRow({ rank, username, balance, colorToken = "default", size = "regular" }: PlayerRowProps) {
    const isLarge = size === "large";
    const avatarSize = isLarge ? 56 : 36;
    const rankColor = resolveRankColor(colorToken);

    return (
        <Paper
            elevation={1}
            sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                px: 2,
                py: isLarge ? 2 : 1.5,
                gap: 2,
            }}
        >
            <Typography
                fontFamily="monospace"
                fontWeight="bold"
                color={rankColor}
                sx={{ width: 28, flexShrink: 0, textAlign: "center" }}
            >
                {rank}
            </Typography>

            <Avatar
                src={getAvatarUrl(username)}
                alt={username}
                sx={{ width: avatarSize, height: avatarSize, flexShrink: 0 }}
            />

            <Typography noWrap sx={{ flex: 1, minWidth: 0 }} fontWeight={isLarge ? "bold" : "regular"}>
                {username}
            </Typography>

            <Typography fontFamily="monospace" fontWeight="bold" sx={{ flexShrink: 0 }}>
                {balance.toLocaleString()}
            </Typography>
        </Paper>
    );
}