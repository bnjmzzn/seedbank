"use client";

import { usePathname } from "next/navigation";
import { Box, Stack, Divider, Avatar, Typography } from "@mui/material";
import BrandLogo from "@/components/shared/BrandLogo";
import {
    DashboardButton,
    LeaderboardButton,
    TransferButton,
    DailyButton,
    LogoutButton,
} from "@/components/shared/NavButtons";
import useUserStore from "@/store/useUserStore";
import NavProfile from "../shared/NavProfile";

export default function DesktopSidebar() {
    const pathname = usePathname();
    const { username } = useUserStore();

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                px: 3,
                py: 4,
                borderRight: "1px solid",
                borderColor: "divider",
                bgcolor: "background.default",
            }}
        >
            <Stack spacing={1}>
                <Box sx={{ px: 0.5, pb: 1 }}>
                    <BrandLogo />
                </Box>

                <DashboardButton selected={pathname === "/dashboard"} />
                <LeaderboardButton selected={pathname === "/leaderboard"} />

                <Divider sx={{ my: 1 }} />

                <TransferButton selected={pathname === "/transfer"} />
                <DailyButton />
            </Stack>

            <Stack spacing={0.5}>
                <NavProfile />
                <LogoutButton />
            </Stack>
        </Box>
    );
}