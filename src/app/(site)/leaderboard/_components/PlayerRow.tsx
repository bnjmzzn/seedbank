"use client";

import { useRouter } from "next/navigation";
import { Avatar, ButtonBase, Paper, Skeleton, Typography } from "@mui/material";
import { getAvatarUrl } from "@/lib/client/utils";

interface PlayerRowProps {
    rank: number;
    username: string;
    balance: number;
    colorToken?: "warning" | "primary" | "error" | "default";
    size?: "regular" | "large";
}

function resolveBgColor(colorToken: PlayerRowProps["colorToken"]) {
    if (colorToken === "warning") return "warning.main";
    if (colorToken === "primary") return "primary.main";
    if (colorToken === "error") return "error.main";
    return "background.paper";
}

export function PlayerRowSkeleton({ size = "regular" }: { size?: "regular" | "large" }) {
    const isLarge = size === "large";
    const avatarSize = isLarge ? 56 : 36;

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
            <Skeleton variant="text" width={28} sx={{ flexShrink: 0 }} />
            <Skeleton variant="circular" width={avatarSize} height={avatarSize} sx={{ flexShrink: 0 }} />
            <Skeleton variant="text" width="40%" sx={{ flex: 1 }} />
            <Skeleton variant="text" width={60} sx={{ flexShrink: 0 }} />
        </Paper>
    );
}

export default function PlayerRow({ rank, username, balance, colorToken = "default", size = "regular" }: PlayerRowProps) {
    const router = useRouter();
    const isLarge = size === "large";
    const avatarSize = isLarge ? 56 : 36;
    const bgColor = resolveBgColor(colorToken);
    const isColored = colorToken !== "default";

    function handleClick() {
        router.push(`/users/${username}`);
    }

    return (
        <ButtonBase
            onClick={handleClick}
            sx={{
                display: "block",
                width: "100%",
                borderRadius: 2,
                "& .row-paper": { transition: "background-color 0.15s ease" },
                "&:hover .row-paper": { filter: "brightness(1.1)" },
                "&:active .row-paper": { filter: "brightness(0.95)" },
            }}
        >
            <Paper
                className="row-paper"
                elevation={1}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 2,
                    px: 2,
                    py: isLarge ? 2 : 1.5,
                    gap: 2,
                    bgcolor: bgColor,
                }}
            >
                <Typography
                    fontFamily="monospace"
                    fontWeight="bold"
                    sx={{
                        width: 28,
                        flexShrink: 0,
                        textAlign: "center",
                        color: isColored ? "common.black" : "text.secondary",
                    }}
                >
                    {rank}
                </Typography>

                <Avatar
                    src={getAvatarUrl(username)}
                    alt={username}
                    sx={{
                        width: avatarSize,
                        height: avatarSize,
                        flexShrink: 0,
                        border: "3px solid",
                        borderColor: isColored ? "common.black" : "divider",
                    }}
                />

                <Typography
                    noWrap
                    sx={{ flex: 1, minWidth: 0, color: isColored ? "common.black" : "text.primary" }}
                    fontWeight={isLarge ? "bold" : "regular"}
                >
                    {username}
                </Typography>

                <Typography
                    fontFamily="monospace"
                    fontWeight="bold"
                    sx={{ flexShrink: 0, color: isColored ? "common.black" : "text.primary" }}
                >
                    {balance.toLocaleString()}
                </Typography>
            </Paper>
        </ButtonBase>
    );
}