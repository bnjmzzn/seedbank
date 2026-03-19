import { supabase } from "./client";
import { createHistoryLog } from "./history";

export async function createUser(username: string, password: string) {
    const { data, error } = await supabase
        .from("users")
        .insert({ username, password })
        .select("id, username, balance")
        .single();

    if (error) {
        if (error.code === "23505") throw new Error("USERNAME_TAKEN");
        throw error;
    }
    return data;
}

export async function removeUserById(userId: string) {
    const { count, error } = await supabase
        .from("users")
        .delete({ count: "exact" })
        .eq("id", userId);

    if (error) throw error;
    if (count === 0) throw new Error("USER_NOT_FOUND");
}

export async function fetchUserById(userId: string) {
    const { data, error } = await supabase
        .from("users")
        .select("id, username, balance")
        .eq("id", userId)
        .single();

    if (error) {
        if (error.code === "PGRST116") throw new Error("USER_NOT_FOUND");
        throw error;
    }
    return data;
}

export async function updateBalance(userId: string, amount: number, reason: string) {
    const userData = await fetchUserById(userId); // throws USER_NOT_FOUND if missing
    const newBalance = userData.balance + amount;

    const { error } = await supabase
        .from("users")
        .update({ balance: newBalance })
        .eq("id", userId);

    if (error) throw error;

    await createHistoryLog(userId, amount, reason);
    return { ...userData, balance: newBalance };
}