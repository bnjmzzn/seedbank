import useSWR from "swr";
import { api } from "@/lib/client/api";
import type { HistoryRow } from "@/types/db";
import type { UserProfile, UserMe } from "@/types/models";

interface UseHistoryParams {
    type?: string;
    limit?: number;
}

export function useHistory(username: string | null, params: UseHistoryParams = {}) {
    const { type, limit } = params;

    const { data, error, isLoading, mutate } = useSWR<HistoryRow[]>(
        username ? ["history", username, type, limit] : null,
        () => api.user.history(username!, { type, limit }),
        { revalidateOnFocus: false }
    );

    return {
        rows: data ?? [],
        isLoading,
        error,
        mutate,
    };
}

export function useProfile(username: string) {
    const { data, error, isLoading, mutate } = useSWR<UserProfile>(
        ["profile", username],
        () => api.user.profile(username),
        { revalidateOnFocus: true }
    );

    return {
        profile: data ?? null,
        isLoading,
        error,
        mutate,
    };
}

export function useMe() {
    const { data, error, isLoading, mutate } = useSWR<UserMe>(
        "me",
        () => api.user.me(),
        { revalidateOnFocus: true }
    );

    return {
        me: data ?? null,
        isLoading,
        error,
        mutate,
    };
}