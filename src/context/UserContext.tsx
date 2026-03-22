"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken, decodeToken, getToken } from "@/lib/client/auth";

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

    function logout() {
        clearToken();
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