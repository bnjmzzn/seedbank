"use client";
import { Box, Stack } from "@mui/material";
import BalanceCard from "./_components/BalanceCard";
import DailyCard from "./_components/DailyCard";
import GameList from "./_components/GameList";
import TransactionFeed from "./_components/HistoryFeed";
import { useHistory, useMe } from "@/lib/client/hooks";
import BalanceChart from "./_components/BalanceChart";
import SectionHeader from "@/components/shared/SectionHeader";

export default function DashboardPage() {
    const { me, isLoading, mutate: mutateMe } = useMe();
    const { rows, isLoading: historyLoading } = useHistory(me?.username ?? "");
    const loading = isLoading || historyLoading || me === null;

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
                        onClaimed={mutateMe}
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
                    <SectionHeader icon="mdi:chart-bar" label="Balance Chart" />
                    <BalanceChart
                        balance={me?.balance ?? 0}
                        rows={rows}
                        isLoading={loading}
                    />
                </Stack>
            </Stack>
        </Stack>
    );
}