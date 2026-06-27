"use client";

import { useParams } from "next/navigation";
import { Stack } from "@mui/material";
import { useHistoryDetail } from "@/lib/client/hooks/data";
import TransactionHeader from "./_components/TransactionHeader";
import TransactionDetails from "./_components/TransactionDetails";

export default function TransactionPage() {
    const params = useParams<{ id: string }>();
    const { transaction, isLoading, error } = useHistoryDetail(params.id);

    return (
        <Stack gap={3} sx={{ minWidth: 0, p: { sm: 1, md: 2 }, maxWidth: 480, mx: "auto" }}>
            <TransactionHeader transaction={transaction} isLoading={isLoading} hasError={!!error} />
            <TransactionDetails transaction={transaction} isLoading={isLoading} hasError={!!error} />
        </Stack>
    );
}