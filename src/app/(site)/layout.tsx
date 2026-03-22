"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenValid } from "@/lib/client/auth";
import { UserProvider } from "@/context/UserContext";
import Navbar from "@/components/shared/Navbar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isTokenValid()) {
            router.replace("/login");
        }
    }, [router]);

    if (!mounted) return null;

    return (
        <UserProvider>
            <Navbar />
            <main className="md:pb-0 pb-14">
                {children}
            </main>
        </UserProvider>
    );
}