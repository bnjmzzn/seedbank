import axios from "axios";
import { storage } from "./storage";

const instance = axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((config) => {
    const token = storage.getToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            storage.clearAuth();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
        const message = error.response?.data?.message ?? "Something went wrong";
        const status = error.response?.status ?? 0;
        return Promise.reject({ message, status });
    }
);

export default instance;