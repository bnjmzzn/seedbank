import { create } from "zustand";

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
    setUser: (username, balance) => set({ username, balance }),
    setBalance: (balance) => set({ balance }),
    logout: () => {
        localStorage.removeItem("token");
        set({ username: null, balance: null });
    },
}));

export default useUserStore;