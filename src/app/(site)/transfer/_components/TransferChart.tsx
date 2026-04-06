"use client";

import { Box, Typography, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useHistory } from "@/lib/client/hooks/useHistory";
import useUserStore from "@/store/useUserStore";
import { HistoryReason } from "@/types/database";

const LIMIT = 10;

export default function TransferChart() {
    const username = useUserStore((s) => s.username);
    const { rows, isLoading } = useHistory(username ?? "", { type: "TRANSFER", limit: LIMIT });

    const data = [...rows].slice(0, LIMIT).reverse();

    const sentData = data.map((r) =>
        r.reason === HistoryReason.Transfer.SENT ? Math.abs(r.change) : null
    );
    const receivedData = data.map((r) =>
        r.reason === HistoryReason.Transfer.RECEIVED ? Math.abs(r.change) : null
    );

    const xIndices = data.map((_, i) => i);

    const formatTimestamp = (r: typeof data[number]) => {
        const d = new Date(r.created_at ?? "");
        return d.toLocaleString("default", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                px: 4,
                py: 3.5,
            }}
        >
            <Typography variant="h6" fontWeight={700}>
                Transfer Activity
            </Typography>

            {isLoading ? (
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CircularProgress size={28} />
                </Box>
            ) : data.length === 0 ? (
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography color="text.secondary" variant="body2">
                        No transfer activity yet
                    </Typography>
                </Box>
            ) : (
                <BarChart
                    height={220}
                    series={[
                        {
                            data: sentData,
                            color: "#f44336",
                            label: "Sent",
                            valueFormatter: (val, { dataIndex }) =>
                                val !== null
                                    ? `${val.toLocaleString()} seeds · ${formatTimestamp(data[dataIndex])}`
                                    : "",
                        },
                        {
                            data: receivedData,
                            color: "#4caf50",
                            label: "Received",
                            valueFormatter: (val, { dataIndex }) =>
                                val !== null
                                    ? `${val.toLocaleString()} seeds · ${formatTimestamp(data[dataIndex])}`
                                    : "",
                        },
                    ]}
                    xAxis={[{
                        scaleType: "band",
                        data: xIndices,
                        tickLabelStyle: { display: "none" },
                        valueFormatter: () => "",
                    }]}
                />
            )}
        </Box>
    );
}