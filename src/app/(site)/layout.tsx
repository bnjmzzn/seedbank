"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MainHeader from "@/components/layout/MainHeader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) router.replace("/login");
    }, [router]);

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