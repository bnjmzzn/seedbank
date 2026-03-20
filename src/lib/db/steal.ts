import { supabase } from "./client";
import type { StealRow } from "@/types/database";

export async function dbCreateStealEntry(
    stealerId: string,
    targetId: string,
    amount: number,
    success: boolean
): Promise<void> {

    const { error } = await supabase
        .from("steals")
        .insert({ stealer_id: stealerId, target_id: targetId, amount, success });

    if (error) throw error;
}

export async function dbGetStealsAgainstUser(
    userId: string
): Promise<StealRow[]> {

    const { data, error } = await supabase
        .from("steals")
        .select("*")
        .eq("target_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

export async function dbGetStealsByUser(
    userId: string
): Promise<StealRow[]> {

    const { data, error } = await supabase
        .from("steals")
        .select("*")
        .eq("stealer_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}