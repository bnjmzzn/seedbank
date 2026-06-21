"use client";

import { use, useMemo } from "react";
import { Stack } from "@mui/material";

import { useHistory, useProfile } from "@/lib/client/hooks/data";
import { HistoryReason } from "@/types/models";

import ProfileCard from "./_components/ProfileCard";
import RankStat from "./_components/RankStat";
import BalanceStat from "./_components/BalanceStat";
import TotalPlayedStat from "./_components/TotalPlayedStat";
import WinRateStat from "./_components/WinRateStat";
import TotalProfitStat from "./_components/TotalProfitStat";
import TotalLostStat from "./_components/TotalLostStat";
import ProfileTabs from "./_components/ProfileTabs";

interface UserPageProps {
    params: Promise<{
        username: string;
    }>;
}

export default function UserPage({ params }: UserPageProps) {
    const { username } = use(params);

    const { profile } = useProfile(username);
    const { rows } = useHistory(username);

    const gameRows = useMemo(
        () => rows.filter((row) => Object.values(HistoryReason.Game).includes(row.reason as HistoryReason.Game)),
        [rows]
    );

    const totalGames = gameRows.length;
    const wins = gameRows.filter((row) => row.change > 0);
    const losses = gameRows.filter((row) => row.change < 0);
    const winRate = totalGames === 0 ? 0 : (wins.length / totalGames) * 100;
    const totalProfit = wins.reduce((sum, row) => sum + row.change, 0);
    const totalLost = losses.reduce((sum, row) => sum + Math.abs(row.change), 0);

    return (
        <Stack gap={4} sx={{ minWidth: 0, overflow: "hidden", p: { sm: 1, md: 2 } }}>
            <Stack direction="row" flexWrap="wrap" gap={2}>
                <Stack flex={2} minWidth={280}>
                    <ProfileCard username={profile?.username} createdAt={profile?.created_at} />
                </Stack>
                <Stack flex={1} minWidth={160}>
                    <RankStat rank={profile?.rank} />
                </Stack>
                <Stack flex={1} minWidth={160}>
                    <BalanceStat balance={profile?.balance} />
                </Stack>
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={2}>
                <Stack flex={1} minWidth={140}>
                    <TotalPlayedStat totalGames={totalGames} />
                </Stack>
                <Stack flex={1} minWidth={140}>
                    <WinRateStat winRate={winRate} />
                </Stack>
                <Stack flex={1} minWidth={140}>
                    <TotalProfitStat totalProfit={totalProfit} />
                </Stack>
                <Stack flex={1} minWidth={140}>
                    <TotalLostStat totalLost={totalLost} />
                </Stack>
            </Stack>

            <ProfileTabs />
        </Stack>
    );
}