import { create } from "zustand";
import { storage } from "@/lib/client/storage";

interface UserState {
    username: string | null;
    balance: number | null;
    setUser: (username: string, balance: number) => void;
    setBalance: (balance: number) => void;
    logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
    username: null,
    balance: null,

    setUser: (username, balance) => set({ 
        username, 
        balance 
    }),

    setBalance: (balance) => set({ 
        balance 
    }),

    logout: () => {
        storage.clearAuth();
        set({ username: null, balance: null });
        
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
    },
}));

export default useUserStore;