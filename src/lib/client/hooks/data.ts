import useSWR from "swr";
import { api } from "@/lib/client/api";
import type { HistoryRow } from "@/types/db";
import type { UserProfile, UserMe } from "@/types/models";
import type { ApiResponse } from "@/types/api";

interface UseHistoryParams {
    type?: string;
    limit?: number;
}

export function useHistory(username: string | null, params: UseHistoryParams = {}) {
    const { type, limit } = params;

    const { data, error, isLoading, mutate } = useSWR<ApiResponse<HistoryRow[]>>(
        username ? ["history", username, type, limit] : null,
        () => api.user.history(username!, { type, limit }).then(res => res.data),
        { revalidateOnFocus: false }
    );

    return {
        rows: data?.data ?? [],
        isLoading,
        error,
        mutate,
    };
}

export function useProfile(username: string) {
    const { data, error, isLoading, mutate } = useSWR<ApiResponse<UserProfile>>(
        ["profile", username],
        () => api.user.profile(username).then(res => res.data),
        { revalidateOnFocus: true }
    );

    return {
        profile: data?.data ?? null,
        isLoading,
        error,
        mutate,
    };
}

export function useMe() {
    const { data, error, isLoading, mutate } = useSWR<ApiResponse<UserMe>>(
        "me",
        () => api.user.me().then(res => res.data),
        { revalidateOnFocus: true }
    );

    return {
        me: data?.data ?? null,
        isLoading,
        error,
        mutate,
    };
}

