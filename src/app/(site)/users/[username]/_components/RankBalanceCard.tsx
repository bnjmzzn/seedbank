"use client";

import { Box, Typography, Skeleton } from "@mui/material";
import { EmojiEvents as RankIcon, Savings as BalanceIcon } from "@mui/icons-material";
import { useProfile } from "@/lib/client/hooks/useProfile";

interface StatItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    isLoading: boolean;
}

function StatItem({ icon, label, value, isLoading }: StatItemProps) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {label}
                </Typography>
                {isLoading ? (
                    <Skeleton variant="text" width={90} height={32} />
                ) : (
                    <Typography variant="h6" fontWeight={800} fontFamily="monospace">
                        {value}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

interface Props {
    username: string;
}

export default function RankBalanceCard({ username }: Props) {
    const { profile, isLoading } = useProfile(username);

    return (
        <Box
            sx={{
                flex: 1,
                borderRadius: 3,
                px: 4,
                py: 3.5,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                minWidth: 0,
            }}
        >
            <StatItem
                icon={<RankIcon sx={{ color: "common.black", fontSize: 24 }} />}
                label="Rank"
                value={`#${profile?.rank}`}
                isLoading={isLoading}
            />
            <StatItem
                icon={<BalanceIcon sx={{ color: "common.black", fontSize: 24 }} />}
                label="Balance"
                value={`${profile?.balance?.toLocaleString() ?? 0} seeds`}
                isLoading={isLoading}
            />
        </Box>
    );
}