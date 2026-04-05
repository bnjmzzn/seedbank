"use client";

import useSWR from "swr";
import { Box, Divider, Skeleton, Typography } from "@mui/material";
import { api } from "@/lib/client/api";
import useUserStore from "@/store/useUserStore";
import LeaderboardRow from "./LeaderboardRow";
import type { LeaderboardEntry } from "@/types/database";
import type { ApiResponse } from "@/types/api";

type Variant = "gold" | "silver" | "bronze" | "default";

function getVariant(rank: number): Variant {
    if (rank === 1) return "gold";
    if (rank === 2) return "silver";
    if (rank === 3) return "bronze";
    return "default";
}

function RowSkeleton() {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 2, py: 1.5, borderRadius: 1, bgcolor: "#1a1a1a" }}>
            <Skeleton variant="text" width={28} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width={120} sx={{ flex: 1 }} />
            <Skeleton variant="text" width={80} />
        </Box>
    );
}

export default function LeaderboardTable() {
    const { username, balance } = useUserStore();

    const { data, isLoading } = useSWR<ApiResponse<LeaderboardEntry[]>>(
        "leaderboard",
        () => api.leaderboard().then((res) => res.data),
        { revalidateOnFocus: false }
    );

    const entries = data?.data ?? [];
    const userEntry = entries.find((e) => e.username === username);

    return (
        <Box sx={{ width: 600, display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="h6" fontWeight={700} sx={{ pb: 1 }}>
                Leaderboard
            </Typography>

            <LeaderboardRow
                rank={userEntry?.rank ?? null}
                username={username ?? ""}
                balance={userEntry?.balance ?? balance ?? 0}
                variant={userEntry ? getVariant(userEntry.rank) : "default"}
                isYou
            />

            <Divider sx={{ my: 0.5 }} />

            {isLoading
                ? Array.from({ length: 10 }).map((_, i) => <RowSkeleton key={i} />)
                : entries.map((entry) => (
                    <LeaderboardRow
                        key={entry.username}
                        rank={entry.rank}
                        username={entry.username}
                        balance={entry.balance}
                        variant={getVariant(entry.rank)}
                        isYou={entry.username === username}
                    />
                ))
            }
        </Box>
    );
}