"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenValid } from "@/lib/client/auth";
import LoginForm from "./_components/LoginForm";
import InfoCarousel from "./_components/InfoCarousel";

export default function LoginPage() {
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (isTokenValid()) {
            router.replace("/dashboard");
        } else {
            setChecked(true);
        }
    }, [router]);

    if (!checked) return null;

    return (
        <div className="flex min-h-screen">
            <div className="hidden md:flex md:flex-1 items-center justify-center">
                <InfoCarousel />
            </div>
            <div className="flex flex-1 items-center justify-center">
                <LoginForm />
            </div>
        </div>
    );
}