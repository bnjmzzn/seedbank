"use client";

import { Paper, Typography, Box, Skeleton } from "@mui/material";
import { AccountBalanceWalletOutlined } from "@mui/icons-material";
import type { HistoryRow } from "@/types/database";
import { useCountUp } from "@/lib/client/hooks";

interface Props {
    balance: number;
    rows: HistoryRow[];
    isLoading?: boolean;
}

const paperSx = {
    p: 2,
    height: 160,
    minWidth: 300,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
};

export default function BalanceCard({ balance, rows, isLoading }: Props) {
    const gain = rows.filter(r => r.change > 0).reduce((sum, r) => sum + r.change, 0);
    const loss = rows.filter(r => r.change < 0).reduce((sum, r) => sum + Math.abs(r.change), 0);
    const total = gain + loss;
    const gainPct = total === 0 ? 0 : (gain / total) * 100;
    const lossPct = total === 0 ? 0 : (loss / total) * 100;
    const animatedBalance = useCountUp(balance);

    return (
        <Paper sx={paperSx} elevation={0}>
            <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccountBalanceWalletOutlined color="disabled" />
                    <Typography color="text.secondary">Balance</Typography>
                </Box>

                {isLoading ? (
                    <Skeleton variant="text" width={200} height={60} />
                ) : (
                    <Typography variant="h4" fontWeight={700}>
                        {animatedBalance.toLocaleString()}{" "}
                        <Typography component="span" variant="h6" color="text.secondary" fontWeight={400}>SEED</Typography>
                    </Typography>
                )}
            </Box>

            <Box>
                {isLoading ? (
                    <>
                        <Skeleton variant="rounded" height={4} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                            <Skeleton variant="text" width={60} />
                            <Skeleton variant="text" width={60} />
                        </Box>
                    </>
                ) : (
                    <>
                        <Box sx={{ display: "flex", height: 4, borderRadius: 999, overflow: "hidden", bgcolor: "divider" }}>
                            {total > 0 && <Box sx={{ width: `${gainPct}%`, bgcolor: "success.main" }} />}
                            {total > 0 && <Box sx={{ width: `${lossPct}%`, bgcolor: "error.main" }} />}
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                            <Typography color="success.main">+{gain.toLocaleString()}</Typography>
                            <Typography color="error.main">-{loss.toLocaleString()}</Typography>
                        </Box>
                    </>
                )}
            </Box>
        </Paper>
    );
}