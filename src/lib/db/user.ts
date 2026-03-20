import { supabase } from "./client";
import type { UserRow } from "@/types/database";
import { AppError, Errors } from "@/lib/error";

export async function dbGetUser(
    field: "id" | "username",
    value: string
): Promise<UserRow> {

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq(field, value)
        .single();

    if (error) {
        if (error.code === "PGRST116" || error.code === "22P02")
            throw new AppError(Errors.USER_NOT_FOUND);
        throw error;
    }
    return data;
}

export async function dbCreateUser(
    username: string,
    password: string
): Promise<UserRow> {

    const { data, error } = await supabase
        .from("users")
        .insert({ username, password })
        .select("*")
        .single();

    if (error) {
        if (error.code === "23505") throw new AppError(Errors.USERNAME_TAKEN);
        throw error;
    }
    return data;
}

export async function dbDeleteUser(
    field: "id" | "username",
    value: string
): Promise<void> {

    const { error } = await supabase
        .from("users")
        .delete()
        .eq(field, value)
        .single();

    if (error) {
        if (error.code === "PGRST116" || error.code === "22P02")
            throw new AppError(Errors.USER_NOT_FOUND);
        throw error;
    }
}

export async function dbUpdateUserBalance(
    userId: string,
    newBalance: number
): Promise<void> {
    
    const { error } = await supabase
        .from("users")
        .update({ balance: newBalance })
        .eq("id", userId);

    if (error) throw error;
}