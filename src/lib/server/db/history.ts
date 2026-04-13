import { supabase } from "./client";
import type { HistoryRow } from "@/types/db";

export async function dbInsertHistory(
    userId: string,
    change: number,
    reason: string,
    meta?: Record<string, unknown>
): Promise<void> {
    const { error } = await supabase
        .from("history")
        .insert({ user_id: userId, change, reason, meta: meta ?? null });

    if (error) throw error;
}

export async function dbGetHistory(filters: {
    userId?: string;
    reason?: string;
    reasonLike?: string;
    limit?: number;
}): Promise<HistoryRow[]> {
    
    let query = supabase
        .from("history")
        .select("*")
        .order("created_at", { ascending: false });

    if (filters.userId) query = query.eq("user_id", filters.userId);
    if (filters.reason) query = query.eq("reason", filters.reason);
    if (filters.reasonLike) query = query.like("reason", `${filters.reasonLike}%`);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
}