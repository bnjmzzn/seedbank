"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenValid } from "@/lib/client/auth";

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
        <>
            {children}
        </>
    );
}