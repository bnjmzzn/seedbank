"use client";

import { Box, Divider } from "@mui/material";
import BalanceCard from "./_components/BalanceCard";
import DailyCard from "./_components/DailyCard";
import GameList from "./_components/GameList";
import TransactionFeed from "./_components/HistoryFeed";
import { useHistory, useMe } from "@/lib/client/hooks";
import BalanceChart from "./_components/BalanceChart";

export default function DashboardPage() {
    const { me, isLoading, mutate: mutateMe } = useMe();
    const { rows, isLoading: historyLoading } = useHistory(me?.username ?? "");

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 0,
            overflow: "hidden",
            p: { sm: 1, md:2 }
        }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <BalanceCard
                    balance={me?.balance ?? 0}
                    rows={rows}
                    isLoading={isLoading || historyLoading}
                />
                <DailyCard
                    daily={me?.daily ?? null}
                    isLoading={isLoading}
                    onClaimed={mutateMe}
                />
            </Box>
            <GameList />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <TransactionFeed rows={rows} isLoading={historyLoading} />
                <BalanceChart
                    balance={me?.balance ?? 0}
                    rows={rows}
                    isLoading={isLoading || historyLoading}
                />
            </Box>
        </Box>
    );
}