import { Box } from "@mui/material";
import TransferStepper from "./_components/TransferStepper";
import TransferHistoryTable from "./_components/TransferHistoryTable";
import TransferChart from "./_components/TransferChart";

interface Props {
    searchParams: Promise<{ to?: string }>;
}

export default async function TransferPage({ searchParams }: Props) {
    const { to } = await searchParams;

    return (
        <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 4 }}>
            <TransferStepper defaultTo={to} />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3,
                    alignItems: "flex-start",
                }}
            >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <TransferHistoryTable />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <TransferChart />
                </Box>
            </Box>
        </Box>
    );
}