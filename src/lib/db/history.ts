import { supabase } from "./client";
import { HistoryReason } from "@/types/database";

export async function createHistoryLog(userId: string, change: number, reason: string) {
    const { error } = await supabase
        .from("history")
        .insert({ user_id: userId, change, reason });

    if (error) throw error;
}

export async function fetchHistoryByUserId(
    userId: string,
    limit: number = 20,
    offset: number = 0
) {
    const { data, error } = await supabase
        .from("history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
}

export async function fetchLastDailyClaim(userId: string) {
    const { data, error } = await supabase
        .from("history")
        .select("created_at")
        .eq("user_id", userId)
        .eq("reason", HistoryReason.DAILY)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ?? null;
}