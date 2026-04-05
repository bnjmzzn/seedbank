import useSWR from "swr";
import { api } from "@/lib/client/api";
import type { HistoryRow } from "@/types/database";
import type { ApiResponse } from "@/types/api";

interface UseHistoryParams {
    type?: string;
    limit?: number;
}

export function useHistory(username: string, params: UseHistoryParams = {}) {
    const { type, limit } = params;

    const { data, error, isLoading, mutate } = useSWR<ApiResponse<HistoryRow[]>>(
        ["history", username, type, limit],
        () => api.user.history(username, { type, limit }).then(res => res.data),
        {
            revalidateOnFocus: false,
        }
    );

    return {
        rows: data?.data ?? [],
        isLoading,
        error,
        mutate,
    };
}