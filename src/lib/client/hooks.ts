import useSWR from "swr";
import { api } from "@/lib/client/api";
import type { HistoryRow, UserProfile, UserMe } from "@/types/database";
import type { ApiResponse } from "@/types/api";
import { useEffect, useRef, useState } from "react";

interface UseHistoryParams {
    type?: string;
    limit?: number;
}

export function useHistory(username: string, params: UseHistoryParams = {}) {
    const { type, limit } = params;

    const { data, error, isLoading, mutate } = useSWR<ApiResponse<HistoryRow[]>>(
        ["history", username, type, limit],
        () => api.user.history(username, { type, limit }).then(res => res.data),
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

export function useCountUp(target: number, duration = 1000, enabled = true) {
    const [display, setDisplay] = useState(target);
    const prev = useRef(target);
    const raf = useRef<number | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const from = prev.current;
        const to = target;
        const diff = to - from;

        if (diff === 0) return;

        const start = performance.now();

        const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setDisplay(Math.round(from + diff * eased));

            if (progress < 1) {
                raf.current = requestAnimationFrame(tick);
            } else {
                prev.current = to;
            }
        };

        raf.current = requestAnimationFrame(tick);

        return () => {
            if (raf.current !== null) cancelAnimationFrame(raf.current);
        };
    }, [target, duration, enabled]);

    return display;
}