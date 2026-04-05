"use client";

import { Box, Typography, Skeleton } from "@mui/material";
import { Savings as BalanceIcon } from "@mui/icons-material";
import useUserStore from "@/store/useUserStore";

export default function BalanceCard() {
    const balance = useUserStore((s) => s.balance);

    return (
        <Box
            sx={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                gap: 3,
                bgcolor: "primary.main",
                borderRadius: 3,
                px: 4,
                py: 3.5,
            }}
        >
            <Box
                sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: "rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <BalanceIcon sx={{ fontSize: 28, color: "common.black" }} />
            </Box>
            <Box>
                <Typography variant="body2" color="common.black" fontWeight={500}>
                    Your Balance
                </Typography>
                {balance === null ? (
                    <Skeleton variant="text" width={160} height={48} sx={{ bgcolor: "rgba(0,0,0,0.15)" }} />
                ) : (
                    <Typography variant="h4" fontWeight={800} fontFamily="monospace" color="common.black">
                        {balance.toLocaleString()} seeds
                    </Typography>
                )}
            </Box>
        </Box>
    );
}