"use client";

import { Box, Stack } from "@mui/material";
import { useLeaderboard, useMe } from "@/lib/client/hooks/data";
import SectionHeader from "@/components/shared/generic/SectionHeader";
import RankCard from "./_components/RankCard";
import GapDisplay from "./_components/GapDisplay";
import TopPodium from "./_components/TopPodium";
import RestList from "./_components/RestList";
import BalanceBarChart from "./_components/BalanceBarChart";

const PODIUM_SIZE = 3;

export default function LeaderboardPage() {
    const { me, isLoading: meLoading } = useMe();
    const { entries, isLoading: leaderboardLoading } = useLeaderboard();
    const loading = meLoading || leaderboardLoading || me === null;

    const podiumEntries = entries.slice(0, PODIUM_SIZE);
    const restEntries = entries.slice(PODIUM_SIZE);

    return (
        <Stack gap={4} sx={{ minWidth: 0, overflow: "hidden", p: { sm: 1, md: 2 } }}>
            <Stack direction="row" flexWrap="wrap" gap={4}>
                <Stack flex={1} minWidth={240}>
                    <RankCard
                        username={me?.username}
                        rank={me?.rank}
                        balance={me?.balance}
                        isLoading={loading}
                    />
                </Stack>
                <Stack flex={1} minWidth={240}>
                    <GapDisplay
                        userRank={me?.rank}
                        userBalance={me?.balance}
                        topEntries={entries}
                        isLoading={loading}
                    />
                </Stack>
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={4}>
                <Stack flex={1} minWidth={240} gap={1}>
                    <SectionHeader icon="mdi:podium-gold" label="Top 3" />
                    <TopPodium entries={podiumEntries} isLoading={loading} />
                </Stack>
                <Stack flex={1} minWidth={280} gap={1}>
                    <SectionHeader icon="mdi:format-list-numbered" label="Rankings" />
                    <RestList entries={restEntries} isLoading={loading} />
                </Stack>
            </Stack>

            <Stack gap={1}>
                <SectionHeader icon="mdi:chart-bar" label="Top 10 Balances" />
                <Box sx={{ height: 320 }}>
                    <BalanceBarChart entries={entries} isLoading={loading} />
                </Box>
            </Stack>
        </Stack>
    );
}