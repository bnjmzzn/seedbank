import axios, { AxiosRequestConfig } from "axios";
import { storage } from "./storage";

const REQUEST_TIMEOUT_MS = 10000;

const rawInstance = axios.create({
    baseURL: "/api",
    timeout: REQUEST_TIMEOUT_MS,
    headers: { "Content-Type": "application/json" },
});

rawInstance.interceptors.request.use((config) => {
    const token = storage.getToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

rawInstance.interceptors.response.use(
    (response) => response.data.data,
    (error) => {
        const isUnauthorized = error.response?.status === 401;
        const isAuthRoute = error.config?.url?.includes("/auth/") ?? false;

        if (isUnauthorized && !isAuthRoute) {
            storage.clearAuth();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        const hasNoResponse = !error.response;
        if (hasNoResponse) {
            return Promise.reject({ code: "NETWORK_ERROR", status: 0 });
        }

        const isServerError = error.response.status >= 500;
        if (isServerError) {
            return Promise.reject({ code: "SERVER_ERROR", status: error.response.status });
        }

        const code = error.response.data?.code ?? "SERVER_ERROR";
        return Promise.reject({ code, status: error.response.status });
    }
);

interface UnwrappedAxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
}

const instance = rawInstance as unknown as UnwrappedAxiosInstance;

export default instance;