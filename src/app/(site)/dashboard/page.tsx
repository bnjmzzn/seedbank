"use client";

import { Box, Stack } from "@mui/material";
import BalanceCard from "./_components/BalanceCard";
import DailyCard from "./_components/DailyCard";
import GameList from "./_components/GameList";
import TransactionFeed from "./_components/HistoryFeed";
import { useHistory, useMe } from "@/lib/client/hooks/data";
import TrendChart from "@/components/shared/data/TrendChart";
import SectionHeader from "@/components/shared/generic/SectionHeader";
import { buildBalanceHistoryData } from "@/lib/client/charts/trend";

export default function DashboardPage() {
    const { me, isLoading, mutate: mutateMe } = useMe();
    const { rows, isLoading: historyLoading, mutate: mutateHistory } = useHistory(me?.username ?? null);
    const loading = isLoading || historyLoading || me === null;

    function handleClaimed() {
        mutateMe();
        mutateHistory();
    }

    return (
        <Stack gap={4} sx={{ minWidth: 0, overflow: "hidden", p: { sm: 1, md: 2 } }}>
            <Stack direction="row" flexWrap="wrap" gap={4}>
                <Stack flex={1} minHeight={150} gap={1}>
                    <SectionHeader icon="mdi:wallet-outline" label="Balance" />
                    <BalanceCard
                        balance={me?.balance ?? 0}
                        rows={rows}
                        isLoading={loading}
                    />
                </Stack>
                <Stack flex={1} minHeight={150} gap={1}>
                    <SectionHeader icon="mdi:calendar-outline" label="Daily Reward" />
                    <DailyCard
                        daily={me?.daily ?? null}
                        isLoading={loading}
                        onClaimed={handleClaimed}
                    />
                </Stack>
            </Stack>

            <Stack gap={1}>
                <SectionHeader icon="mdi:controller" label="Games" />
                <GameList isLoading={loading} />
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={4}>
                <Stack flex={1} gap={1}>
                    <SectionHeader icon="mdi:history" label="Recent Activity" />
                    <TransactionFeed rows={rows} isLoading={loading} />
                </Stack>
                <Stack flex={1} gap={1}>
                    <SectionHeader icon="mdi:chart-line" label="Balance History" />
                    <Box sx={{ height: 200 }}>
                        <TrendChart data={buildBalanceHistoryData(rows)} isLoading={loading} />
                    </Box>
                </Stack>
            </Stack>
        </Stack>
    );
}