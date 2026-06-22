"use client";

import { use, useState } from "react";
import { Stack, Box, Tabs, Tab, Typography } from "@mui/material";

import { useHistory, useProfile } from "@/lib/client/hooks/data";
import { buildActionsRadarData, buildBalanceHistoryData, buildGamesRadarData } from "@/lib/client/utils";
import { HistoryReason } from "@/types/models";

import ProfileCard from "./_components/stack1/ProfileCard";
import RankStat from "./_components/stack1/RankStat";
import BalanceStat from "./_components/stack1/BalanceStat";
import TotalPlayedStat from "./_components/stack2/TotalPlayedStat";
import WinRateStat from "./_components/stack2/WinRateStat";
import TotalProfitStat from "./_components/stack2/TotalProfitStat";
import TotalLostStat from "./_components/stack2/TotalLostStat";

import ActivityRadarChart from "@/components/shared/data/ActivityRadarChart";
import BalanceTrendChart from "@/components/shared/data/BalanceTrendChart";
import HistoryList from "@/components/shared/data/HistoryList";

interface UserPageProps {
    params: Promise<{
        username: string;
    }>;
}

const ACTIONS_RADAR_LIMIT = 5;

enum ProfileTab {
    Actions = 0,
    History = 1,
    Stats = 2,
}

export default function UserPage({ params }: UserPageProps) {
    const { username } = use(params);

    const { profile, isLoading: isProfileLoading } = useProfile(username);
    const { rows, isLoading: isHistoryLoading } = useHistory(username);

    const [tab, setTab] = useState<ProfileTab>(ProfileTab.Actions);

    function handleTabChange(_: React.SyntheticEvent, newValue: ProfileTab) {
        setTab(newValue);
    }

    const gameRows = rows.filter((row) =>
        Object.values(HistoryReason.Game).includes(row.reason as HistoryReason.Game)
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
                    <ProfileCard
                        username={profile?.username}
                        createdAt={profile?.created_at}
                        isLoading={isProfileLoading}
                    />
                </Stack>
                <Stack flex={1} minWidth={160}>
                    <RankStat rank={profile?.rank} isLoading={isProfileLoading} />
                </Stack>
                <Stack flex={1} minWidth={160}>
                    <BalanceStat balance={profile?.balance} isLoading={isProfileLoading} />
                </Stack>
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={2}>
                <Stack flex={1} minWidth={140}>
                    <TotalPlayedStat totalGames={totalGames} isLoading={isHistoryLoading} />
                </Stack>
                <Stack flex={1} minWidth={140}>
                    <WinRateStat winRate={winRate} isLoading={isHistoryLoading} />
                </Stack>
                <Stack flex={1} minWidth={140}>
                    <TotalProfitStat totalProfit={totalProfit} isLoading={isHistoryLoading} />
                </Stack>
                <Stack flex={1} minWidth={140}>
                    <TotalLostStat totalLost={totalLost} isLoading={isHistoryLoading} />
                </Stack>
            </Stack>

            <Box sx={{ bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
                <Tabs value={tab} onChange={handleTabChange} sx={{ borderBottom: "1px solid", borderColor: "divider", px: 1 }}>
                    <Tab label="Actions" />
                    <Tab label="History" />
                    <Tab label="Stats" />
                </Tabs>

                <Box sx={{ p: 1 }}>
                    {tab === ProfileTab.Actions && (
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                            <Box sx={{ flex: 1, minWidth: 240, height: 300, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                                <ActivityRadarChart data={buildGamesRadarData(rows)} isLoading={isHistoryLoading} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 240, height: 300, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                                <ActivityRadarChart data={buildActionsRadarData(rows, ACTIONS_RADAR_LIMIT)} isLoading={isHistoryLoading} />
                            </Box>
                        </Stack>
                    )}

                    {tab === ProfileTab.History && (
                        <Stack gap={1}>
                            <Box sx={{ height: 200, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                                <BalanceTrendChart data={buildBalanceHistoryData(rows)} isLoading={isHistoryLoading} />
                            </Box>
                            <HistoryList rows={rows} isLoading={isHistoryLoading} maxRowsPerPage={5} />
                        </Stack>
                    )}

                    {tab === ProfileTab.Stats && (
                        <Box sx={{ height: 400, border: "1px solid", borderColor: "divider", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography variant="body2" color="text.secondary">Comprehensive stats spreadsheet, games breakdown, transfer totals, steal totals, daily count, net balance change per category</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Stack>
    );
}