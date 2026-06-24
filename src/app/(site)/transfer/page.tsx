"use client";

import { Stack } from "@mui/material";

import { useHistory, useMe } from "@/lib/client/hooks/data";
import SectionHeader from "@/components/shared/generic/SectionHeader";
import HistoryTable from "@/components/shared/data/HistoryList";

import TransferForm from "./_components/TransferForm";
import { CURRENCY_TICKER } from "@/lib/config";

export default function TransferPage() {
    const { me, mutate: mutateMe } = useMe();
    const { rows, isLoading: historyLoading, mutate: mutateHistory } = useHistory(me?.username ?? null);

    const balance = me?.balance ?? 0;

    function handleSuccess() {
        mutateMe();
        mutateHistory();
    }

    return (
        <Stack gap={4} sx={{ minWidth: 0, overflow: "hidden", p: { sm: 1, md: 2 } }}>
            <Stack direction="row" flexWrap="wrap" gap={4}>
                <Stack flex={1} gap={1} minWidth={280}>
                    <SectionHeader icon="mdi:send-outline" label={`Send ${CURRENCY_TICKER}s`} />
                    <TransferForm balance={balance} onSuccess={handleSuccess} />
                </Stack>
                <Stack flex={2} gap={1} minWidth={280}>
                    <SectionHeader icon="mdi:history" label="Recent Activity" />
                    <HistoryTable
                        rows={rows}
                        type="TRANSFER"
                        isLoading={historyLoading}
                        maxRowsPerPage={5}
                    />
                </Stack>
            </Stack>
        </Stack>
    );
}