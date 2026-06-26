"use client";

import { Stack } from "@mui/material";
import type { LeaderboardEntry } from "@/types/models";
import PlayerRow from "./PlayerRow";

interface TopPodiumProps {
    entries: LeaderboardEntry[];
}

const PODIUM_COLORS: Array<"warning" | "primary" | "error"> = ["warning", "primary", "error"];

export default function TopPodium({ entries }: TopPodiumProps) {
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