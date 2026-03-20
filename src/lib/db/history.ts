import { supabase } from "./client";
import type { HistoryRow } from "@/types/database";
import { HistoryReason } from "@/types/database";

export async function dbCreateHistoryEntry(
    userId: string,
    change: number,
    reason: string
): Promise<void> {

    const { error } = await supabase
        .from("history")
        .insert({ user_id: userId, change, reason });

    if (error) throw error;
}

export async function dbGetLastDailyClaim(
    userId: string
): Promise<HistoryRow | null> {

    const { data, error } = await supabase
        .from("history")
        .select("*")
        .eq("user_id", userId)
        .eq("reason", HistoryReason.DAILY)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ?? null;
}

export async function dbGetUserHistory(
    userId: string,
    limit: number,
    offset: number
): Promise<HistoryRow[]> {

    const { data, error } = await supabase
        .from("history")
        .select("change, reason, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) throw error;
    return data ?? [];
}