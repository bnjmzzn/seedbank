import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storage } from "@/lib/client/storage";

interface DailyState {
    claimable: boolean | null;
    remaining: number | null;
}

interface UserState {
    username: string | null;
    balance: number | null;
    daily: DailyState;
    setUser: (username: string, balance: number) => void;
    setBalance: (balance: number) => void;
    setDaily: (daily: DailyState) => void;
    logout: () => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            username: null,
            balance: null,
            daily: { claimable: null, remaining: null },

            setUser: (username, balance) => set({ username, balance }),
            setBalance: (balance) => set({ balance }),
            setDaily: (daily) => set({ daily }),

            logout: () => {
                storage.clearAuth();
                set({ username: null, balance: null, daily: { claimable: null, remaining: null } });
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            },
        }),
        {
            name: "user",
            partialize: (state: UserState) => ({ 
                username: state.username, 
                balance: state.balance,
                daily: state.daily,
            }),
        }
    )
);

export default useUserStore;