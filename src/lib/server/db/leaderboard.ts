import { supabase } from "./client";
import { LEADERBOARD_LIMIT } from "@/lib/config";
import type { UserRow } from "@/types/database";

export async function dbGetTopBalances(): Promise<UserRow[]> {
    const { data, error } = await supabase
        .from("users")
        .select("id, username, balance")
        .order("balance", { ascending: false })
        .limit(LEADERBOARD_LIMIT);

    if (error) throw error;
    return data ?? [];
}