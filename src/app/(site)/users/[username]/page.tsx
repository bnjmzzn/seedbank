"use client";

import { use, useMemo, useState } from "react";
import { Stack, Box, Tabs, Tab, Typography } from "@mui/material";

import { useHistory, useProfile } from "@/lib/client/hooks/data";
import { HistoryReason } from "@/types/models";

import ProfileCard from "./_components/stack1/ProfileCard";
import RankStat from "./_components/stack1/RankStat";
import BalanceStat from "./_components/stack1/BalanceStat";
import TotalPlayedStat from "./_components/stack2/TotalPlayedStat";
import WinRateStat from "./_components/stack2/WinRateStat";
import TotalProfitStat from "./_components/stack2/TotalProfitStat";
import TotalLostStat from "./_components/stack2/TotalLostStat";
import RadarComparisonChart from "@/components/shared/data/RadarChart";
import { buildActionsRadarData, buildBalanceHistoryData, buildGamesRadarData } from "@/lib/client/utils";
import LineComparisonChart from "@/components/shared/data/LineChart";
import HistoryList from "@/components/shared/data/HistoryList";

interface UserPageProps {
    params: Promise<{
        username: string;
    }>;
}

export default function UserPage({ params }: UserPageProps) {
    const { username } = use(params);

    const { profile } = useProfile(username);
    const { rows, isLoading } = useHistory(username);

    const [tab, setTab] = useState(0);

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

            <Box sx={{ bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
                <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{ borderBottom: "1px solid", borderColor: "divider", px: 1 }}>
                    <Tab label="Actions" />
                    <Tab label="History" />
                    <Tab label="Stats" />
                </Tabs>

                <Box sx={{ p: 1 }}>
                {tab === 0 && (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        <Box sx={{ flex: 1, minWidth: 240, height: 300, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                            <RadarComparisonChart data={buildGamesRadarData(rows)} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 240, height: 300, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                            <RadarComparisonChart data={buildActionsRadarData(rows, 5)} />
                        </Box>
                    </Stack>
                )}

                    {tab === 1 && (
                        <Stack gap={1}>
                            <Box sx={{ height: 200, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                                <LineComparisonChart data={buildBalanceHistoryData(rows)} />
                            </Box>
                            <HistoryList rows={rows} isLoading={isLoading} maxRowsPerPage={5} />
                        </Stack>
                    )}
                    
                    {tab === 2 && (
                        <Box sx={{ height: 400, border: "1px solid", borderColor: "divider", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography variant="body2" color="text.secondary">Comprehensive stats spreadsheet, games breakdown, transfer totals, steal totals, daily count, net balance change per category</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Stack>
    );
}