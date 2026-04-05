import useSWR from "swr";
import { api } from "@/lib/client/api";
import type { UserProfile } from "@/types/database";
import type { ApiResponse } from "@/types/api";

export function useProfile(username: string) {
    const { data, error, isLoading, mutate } = useSWR<ApiResponse<UserProfile>>(
        ["profile", username],
        () => api.user.profile(username).then(res => res.data),
        { revalidateOnFocus: false }
    );

    return {
        profile: data?.data ?? null,
        isLoading,
        error,
        mutate,
    };
}