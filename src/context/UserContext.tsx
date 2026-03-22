"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAllAppData, decodeToken, getToken } from "@/lib/client/auth";
import api from "@/lib/client/axios";

interface UserContextValue {
    username: string;
    balance: number;
    setBalance: (balance: number) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const token = getToken();
    const decoded = token ? decodeToken(token) : null;

    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (!decoded) return;
        api.get(`/api/users/${decoded.username}/profile`)
            .then((res) => setBalance(res.data.data.balance))
            .catch(() => {});
    }, [decoded?.username]);

    function logout() {
        clearAllAppData();
        router.replace("/login");
    }

    if (!decoded) return null;

    return (
        <UserContext.Provider value={{ username: decoded.username, balance, setBalance, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser(): UserContextValue {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
}