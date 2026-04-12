"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/client/storage";
import { useMe } from "@/lib/client/hooks";
import Box from "@mui/material/Box";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { me, isLoading } = useMe();

    useEffect(() => {
        if (!storage.getToken()) {
            router.replace("/login");
        }
    }, [router]);

    if (isLoading) return null;

    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    overflowX: "hidden",
                    overflowY: "scroll",
                    p: 3,
                }}
            >
                {children}
            </Box>
            <BottomNav />
        </Box>
    );
}