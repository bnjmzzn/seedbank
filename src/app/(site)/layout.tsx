"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/client/storage";
import Box from "@mui/material/Box";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = storage.getToken();

        if (!token) {
            router.replace("/login");
            return;
        }

        setIsAuthorized(true);
    }, [router]);

    if (!isAuthorized) return null;

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
                    pb: { xs: 10, md: 3 },
                }}
            >
                {children}
            </Box>
            <BottomNav />
        </Box>
    );
}