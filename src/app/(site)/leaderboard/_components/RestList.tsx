"use client";

import { Stack } from "@mui/material";
import type { LeaderboardEntry } from "@/types/models";
import PlayerRow from "./PlayerRow";

interface RestListProps {
    entries: LeaderboardEntry[];
}

export default function RestList({ entries }: RestListProps) {
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