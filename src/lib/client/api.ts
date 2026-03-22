import api from "@/lib/client/axios";

export async function login(username: string, password: string) {
    const res = await api.post("/api/auth/login", { username, password });
    return res.data;
}

export async function register(username: string, password: string) {
    const res = await api.post("/api/auth/register", { username, password });
    return res.data;
}

export async function transfer(toUsername: string, amount: number) {
    const res = await api.post("/api/transfer", { toUsername, amount });
    return res.data;
}

export async function fetchHistory(username: string, limit = 20, offset = 0) {
    const res = await api.get(`/api/users/${username}/history`, {
        params: { limit, offset },
    });
    return res.data;
}

export async function steal(fromUsername: string, amount: number) {
    const res = await api.post("/api/steal", { fromUsername, amount });
    return res.data;
}

export async function fetchProfile(username: string) {
    const res = await api.get(`/api/users/${username}/profile`);
    return res.data;
}

export async function playGame(game: string, bet: number) {
    const res = await api.post("/api/play", { game, bet });
    return res.data;
}