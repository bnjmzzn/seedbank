"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/client/storage";
import { api } from "@/lib/client/api";
import useUserStore from "@/store/useUserStore";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { setUser, setDaily } = useUserStore();

    useEffect(() => {
        const token = storage.getToken();
        if (!token) {
            router.replace("/login");
            return;
        }

        api.user.me()
            .then((res) => {
                const { username, balance, daily } = res.data.data;
                setUser(username, balance);
                setDaily(daily);
            })
            .catch(() => {
                router.replace("/login");
            });
    }, []);

    return (
        <>
            {children}
        </>
    );
}