import { supabase } from "./client";
import type { UserRow } from "@/types/db";
import { AppError, Errors } from "@/lib/server/error";

export async function dbGetUser(by: "id" | "username", value: string): Promise<UserRow> {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq(by, value)
        .single();

    if (error) {
        if (error.code === "PGRST116" || error.code === "22P02")
            throw new AppError(Errors.USER_NOT_FOUND);
        throw error;
    }
    return data;
}

export async function dbInsertUser(username: string, hashedPassword: string): Promise<UserRow> {
    const { data, error } = await supabase
        .from("users")
        .insert({ username, password: hashedPassword })
        .select("*")
        .single();

    if (error) {
        if (error.code === "23505") throw new AppError(Errors.USERNAME_TAKEN);
        throw error;
    }
    return data;
}

export async function dbUpdateUserBalance(userId: string, newBalance: number): Promise<void> {
    const { error } = await supabase
        .from("users")
        .update({ balance: newBalance })
        .eq("id", userId);

    if (error) throw error;
}

export async function dbGetUserRank(balance: number): Promise<number> {
    const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gt("balance", balance);

    if (error) throw error;
    return (count ?? 0) + 1;
}

export async function dbGetTopUsers(limit: number): Promise<UserRow[]> {
    const { data, error } = await supabase
        .from("users")
        .select("id, username, balance")
        .order("balance", { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data ?? [];
}