"use client";

import { Stack } from "@mui/material";
import type { LeaderboardEntry } from "@/types/models";
import PlayerRow, { PlayerRowSkeleton } from "./PlayerRow";

interface TopPodiumProps {
    entries: LeaderboardEntry[];
    isLoading?: boolean;
}

const PODIUM_COLORS: Array<"warning" | "primary" | "error"> = ["warning", "primary", "error"];
const PODIUM_SKELETON_COUNT = 3;

export default function TopPodium({ entries, isLoading }: TopPodiumProps) {
    if (isLoading) {
        return (
            <Stack gap={1}>
                {Array.from({ length: PODIUM_SKELETON_COUNT }).map((_, i) => (
                    <PlayerRowSkeleton key={i} size="large" />
                ))}
            </Stack>
        );
    }

    return (
        <Stack gap={1}>
            {entries.map((entry, index) => (
                <PlayerRow
                    key={entry.username}
                    rank={entry.rank}
                    username={entry.username}
                    balance={entry.balance}
                    colorToken={PODIUM_COLORS[index]}
                    size="large"
                />
            ))}
        </Stack>
    );
}