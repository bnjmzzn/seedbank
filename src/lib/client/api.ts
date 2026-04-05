import axios from "./axios";
import { LoginInput, RegisterInput } from "@/lib/client/validation";

export const api = {
    auth: {
        login: (data: LoginInput) => axios.post("/auth/login", data),
        register: (data: RegisterInput) => axios.post("/auth/register", data),
    },
    user: {
        me: () => axios.get("/users/me"),
        profile: (username: string) => axios.get(`/users/${username}/profile`),
        daily: {
            status: () => axios.get("/daily"),
            claim: () => axios.post("/daily"),
        },
    },
    transfer: (toUsername: string, amount: number) =>
        axios.post("/transfer", { toUsername, amount }),
};