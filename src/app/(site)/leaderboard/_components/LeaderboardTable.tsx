"use client";

import useSWR from "swr";
import { Box, Divider, Skeleton, Typography } from "@mui/material";
import { api } from "@/lib/client/api";
import useUserStore from "@/store/useUserStore";
import YourRankCard from "./UserRankCard";
import PodiumCard from "./PodiumCard";
import LeaderboardRow from "./LeaderboardRow";
import type { LeaderboardEntry } from "@/types/database";
import type { ApiResponse } from "@/types/api";

const LEADERBOARD_LIMIT = 25;

function PodiumSkeleton() {
    return (
        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
            {[1, 2, 3].map((r) => (
                <Skeleton key={r} variant="rounded" height={180} sx={{ flex: 1, borderRadius: 2 }} />
            ))}
        </Box>
    );
}

function RowSkeleton() {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 2, py: 2, borderRadius: 2, bgcolor: "action.hover" }}>
            <Skeleton variant="text" width={32} />
            <Skeleton variant="circular" width={36} height={36} />
            <Skeleton variant="text" sx={{ flex: 1 }} />
            <Skeleton variant="text" width={96} />
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
    const podium = entries.filter((e) => e.rank <= 3) as (LeaderboardEntry & { rank: 1 | 2 | 3 })[];
    const rest = entries.filter((e) => e.rank > 3).slice(0, LEADERBOARD_LIMIT - 3);

    const podiumOrder = [
        podium.find((e) => e.rank === 2),
        podium.find((e) => e.rank === 1),
        podium.find((e) => e.rank === 3),
    ].filter(Boolean) as (LeaderboardEntry & { rank: 1 | 2 | 3 })[];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h5" fontWeight={700}>
                Leaderboard
            </Typography>

            {isLoading ? (
                <Skeleton variant="rounded" height={88} sx={{ borderRadius: 2 }} />
            ) : (
                <YourRankCard
                    rank={userEntry?.rank ?? null}
                    username={username ?? ""}
                    balance={userEntry?.balance ?? balance ?? 0}
                />
            )}

            <Divider sx={{ color: "divider" }}>Top 3</Divider>

            {isLoading ? (
                <PodiumSkeleton />
            ) : (
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                    {podiumOrder.map((entry) => (
                        <PodiumCard
                            key={entry.username}
                            rank={entry.rank}
                            username={entry.username}
                            balance={entry.balance}
                            isYou={entry.username === username}
                        />
                    ))}
                </Box>
            )}

            <Divider />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} />)
                    : rest.map((entry) => (
                        <LeaderboardRow
                            key={entry.username}
                            rank={entry.rank}
                            username={entry.username}
                            balance={entry.balance}
                            isYou={entry.username === username}
                        />
                    ))
                }
            </Box>
        </Box>
    );
}