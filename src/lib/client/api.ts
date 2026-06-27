import axios from "./axios";
import type { LoginInput, RegisterInput } from "@/lib/client/validation";

export const api = {
    auth: {
        login: (data: LoginInput & { captchaToken: string }) =>
            axios.post("/auth/login", data),
        register: (data: RegisterInput & { captchaToken: string }) =>
            axios.post("/auth/register", data),
    },
    user: {
        me: () =>
            axios.get("/users/me"),
        profile: (username: string) =>
            axios.get(`/users/${username}/profile`),
        history: (username: string, params?: { type?: string; limit?: number }) =>
            axios.get(`/users/${username}/history`, { params }),
        daily: {
            status: () => axios.get("/daily"),
            claim: () => axios.post("/daily"),
        },
        play: (game: string, bet: number) =>
            axios.post("/play", { game, bet }),
        transfer: (toUsername: string, amount: number) =>
            axios.post("/transfer", { toUsername, amount }),
        steal: (fromUsername: string, amount: number) =>
            axios.post("/steal", { fromUsername, amount }),
    },
    public: {
        leaderboard: () =>
            axios.get("/leaderboard"),
        history: (id: string) =>
            axios.get(`/history/${id}`),
    }
};