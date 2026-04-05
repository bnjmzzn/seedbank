"use client";

import { useRouter } from "next/navigation";
import { Box, Avatar, Typography, ButtonBase } from "@mui/material";
import { getAvatarUrl } from "@/lib/client/avatar";

type Variant = "gold" | "silver" | "bronze" | "default";

const BG: Record<Variant, string> = {
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#7c3f00",
    default: "#1a1a1a",
};

const TEXT: Record<Variant, string> = {
    gold: "#000000",
    silver: "#000000",
    bronze: "#000000",
    default: "inherit",
};

interface Props {
    rank: number | null;
    username: string;
    balance: number;
    variant?: Variant;
    isYou?: boolean;
}

export default function LeaderboardRow({ rank, username, balance, variant = "default", isYou = false }: Props) {
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
                py: 1.5,
                borderRadius: 1,
                bgcolor: BG[variant],
                color: TEXT[variant],
                transition: "transform 150ms ease-in-out",
                "&:hover": {
                    transform: "scale(1.01)",
                },
            }}
        >
            <Typography
                fontWeight={700}
                fontFamily="monospace"
                sx={{ width: 28, textAlign: "center", flexShrink: 0, color: TEXT[variant] }}
            >
                {rank ?? "—"}
            </Typography>
            <Avatar
                src={getAvatarUrl(username)}
                sx={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    border: "3px solid",
                    borderColor: "background.default",
                }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
                <Typography fontWeight={600} noWrap>
                    @{username}
                </Typography>
                {isYou && (
                    <Typography fontWeight={500} sx={{ color: TEXT[variant] }}>
                        (you)
                    </Typography>
                )}
            </Box>
            <Typography fontWeight={700} fontFamily="monospace" flexShrink={0}>
                {balance.toLocaleString()} seeds
            </Typography>
        </ButtonBase>
    );
}