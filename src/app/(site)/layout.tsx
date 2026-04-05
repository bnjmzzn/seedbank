"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MainHeader from "@/components/layout/MainHeader";
import { storage } from "@/lib/client/storage";
import { api } from "@/lib/client/api";
import useUserStore from "@/store/useUserStore";
import { showSnackbar } from "@/components/shared/SnackBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        const token = storage.getToken();
        if (!token) {
            router.replace("/login");
            return;
        }

        api.user.me()
            .then((res) => {
                const { username, balance } = res.data.data;
                setUser(username, balance);
            })
            .catch((error) => {
                showSnackbar(error, "error")
                router.replace("/login");
            });
    }, []);

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box sx={{ width: 270, flexShrink: 0 }}>
                <DesktopSidebar />
            </Box>
            <Box component="main" sx={{ flex: 1 }}>
                <MainHeader />
                {children}
            </Box>
        </Box>
    );
}