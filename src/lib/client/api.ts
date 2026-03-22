import api from "@/lib/client/axios";

export async function login(username: string, password: string) {
    const res = await api.post("/api/auth/login", { username, password });
    return res.data;
}

export async function register(username: string, password: string) {
    const res = await api.post("/api/auth/register", { username, password });
    return res.data;
}