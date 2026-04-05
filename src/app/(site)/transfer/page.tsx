import { Box } from "@mui/material";
import TransferStepper from "./_components/TransferStepper";
import TransferHistoryTable from "./_components/TransferHistoryTable";

interface Props {
    searchParams: Promise<{ to?: string }>;
}

export default async function TransferPage({ searchParams }: Props) {
    const { to } = await searchParams;

    return (
        <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 4 }}>
            <TransferStepper defaultTo={to} />
            <Box sx={{ width: "60%", alignSelf: "center" }}>
                <TransferHistoryTable />
            </Box>
        </Box>
    );
}