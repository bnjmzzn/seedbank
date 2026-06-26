"use client";

import { Stack } from "@mui/material";
import type { LeaderboardEntry } from "@/types/models";
import PlayerRow, { PlayerRowSkeleton } from "./PlayerRow";

interface RestListProps {
    entries: LeaderboardEntry[];
    isLoading?: boolean;
}

const REST_SKELETON_COUNT = 7;

export default function RestList({ entries, isLoading }: RestListProps) {
    if (isLoading) {
        return (
            <Stack gap={1}>
                {Array.from({ length: REST_SKELETON_COUNT }).map((_, i) => (
                    <PlayerRowSkeleton key={i} />
                ))}
            </Stack>
        );
    }

    return (
        <Stack gap={1}>
            {entries.map((entry) => (
                <PlayerRow
                    key={entry.username}
                    rank={entry.rank}
                    username={entry.username}
                    balance={entry.balance}
                />
            ))}
        </Stack>
    );
}