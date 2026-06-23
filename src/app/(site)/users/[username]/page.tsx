"use client";

import { use, useState } from "react";
import { Stack, Box, Tabs, Tab, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useHistory, useProfile } from "@/lib/client/hooks/data";
import { buildBalanceHistoryData, buildActivityTrendData } from "@/lib/client/charts/trend";
import { buildGamesWonRadarData, buildGamesLostRadarData } from "@/lib/client/charts/radar";
import { HistoryReason } from "@/types/models";

import ProfileCard from "./_components/stack1/ProfileCard";
import RankStat from "./_components/stack1/RankStat";
import BalanceStat from "./_components/stack1/BalanceStat";
import TotalPlayedStat from "./_components/stack2/TotalPlayedStat";
import WinRateStat from "./_components/stack2/WinRateStat";
import TotalProfitStat from "./_components/stack2/TotalProfitStat";
import TotalLostStat from "./_components/stack2/TotalLostStat";
import StatsBreakdown from "./_components/StatsBreakdown";

import RadarChart from "@/components/shared/data/RadarChart";
import TrendChart from "@/components/shared/data/TrendChart";
import HistoryList from "@/components/shared/data/HistoryList";
import SectionHeader from "@/components/shared/generic/SectionHeader";

interface UserPageProps {
    params: Promise<{
        username: string;
    }>;
}

export default function UserPage({ params }: UserPageProps) {
    const { username } = use(params);

    const { profile, isLoading: isProfileLoading } = useProfile(username);
    const { rows, isLoading: isHistoryLoading } = useHistory(username);

    const isPageLoading = isProfileLoading || isHistoryLoading;

    const [tab, setTab] = useState(0);

    function handleTabChange(_: React.SyntheticEvent, newValue: number) {
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

    const theme = useTheme();

    const profileTabs = [
        {
            label: "History",
            content: (
                <Stack gap={2}>
                    <Box sx={{ height: 200 }}>
                        <SectionHeader icon="uil:chart-line" label="Balance History" />
                        <TrendChart data={buildBalanceHistoryData(rows)} isLoading={isPageLoading} />
                    </Box>
                    <SectionHeader icon="material-symbols:history" label="History" />
                    <HistoryList rows={rows} isLoading={isPageLoading} maxRowsPerPage={5} />
                </Stack>
            ),
        },
        {
            label: "Actions",
            content: (
                <Stack gap={2}>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        <Box sx={{ flex: 1, minWidth: 240, height: 300 }}>
                            <SectionHeader icon="mdi:controller" label="Games Won" />
                            <RadarChart
                                data={buildGamesWonRadarData(rows)}
                                isLoading={isPageLoading}
                                color={theme.palette.primary.main}
                                emptyText="Not enough wins to show yet."
                            />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 240, height: 300 }}>
                            <SectionHeader icon="mdi:controller-off" label="Games Lost" />
                            <RadarChart
                                data={buildGamesLostRadarData(rows)}
                                isLoading={isPageLoading}
                                color={theme.palette.error.main}
                                emptyText="Not enough losses to show yet."
                            />
                        </Box>
                    </Stack>
                    <Box sx={{ height: 200 }}>
                        <SectionHeader icon="mdi:calendar-month" label="Activity Graph" />
                        <TrendChart data={buildActivityTrendData(rows)} isLoading={isPageLoading} />
                    </Box>
                </Stack>
            ),
        },
        {
            label: "Stats",
            content: (
                <StatsBreakdown rows={rows} isLoading={isPageLoading} />
            ),
        },
    ];

    return (
        <Stack gap={4} sx={{ minWidth: 0, overflow: "hidden", p: { sm: 1, md: 2 } }}>
            <Stack direction="row" flexWrap="wrap" gap={2}>
                <Stack flex={2} minWidth={280}>
                    <ProfileCard
                        username={profile?.username}
                        createdAt={profile?.created_at}
                        isLoading={isPageLoading}
                    />
                </Stack>
                <Stack flex={1} minWidth={160}>
                    <RankStat rank={profile?.rank} isLoading={isPageLoading} />
                </Stack>
                <Stack flex={1} minWidth={160}>
                    <BalanceStat balance={profile?.balance} isLoading={isPageLoading} />
                </Stack>
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={2}>
                <Stack flex={1} minWidth={140}>
                    <TotalPlayedStat totalGames={totalGames} isLoading={isPageLoading} />
                </Stack>
                <Stack flex={1} minWidth={140}>
                    <WinRateStat winRate={winRate} isLoading={isPageLoading} />
                </Stack>
                <Stack flex={1} minWidth={140}>
                    <TotalProfitStat totalProfit={totalProfit} isLoading={isPageLoading} />
                </Stack>
                <Stack flex={1} minWidth={140}>
                    <TotalLostStat totalLost={totalLost} isLoading={isPageLoading} />
                </Stack>
            </Stack>

            <Box sx={{ bgcolor: "background.paper" }}>
                <Tabs value={tab} onChange={handleTabChange} sx={{ borderBottom: "2px solid", borderColor: "divider" }}>
                    {profileTabs.map((profileTab) => (
                        <Tab key={profileTab.label} label={profileTab.label} />
                    ))}
                </Tabs>

                <Box sx={{ p: 1 }}>
                    {profileTabs[tab].content}
                </Box>
            </Box>
        </Stack>
    );
}