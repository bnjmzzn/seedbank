import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function createUser(
    username: string,
    password: string
) {
    const { error } = await supabase
        .from("users")
        .insert({ username, password });

    if (error) throw error
    return true;
}

export async function removeUserByUsername(username: string) {
    const { error } = await supabase
        .from("users")
        .delete()
        .eq("username", username)
        .single();

    if (error) throw error;
    return true;
}

export async function fetchUserByUsername(
    username: string
) {
    const { data, error } = await supabase
        .from("users")
        .select("id, username, balance")
        .eq("username", username)
        .single();

    if (error) throw error;
    return data
}

export async function updateBalance(username: string, amount: number, reason: string) {
    const userData = await fetchUserByUsername(username); // race hazard

    const newBalance = userData.balance + amount;

    const { error } = await supabase
        .from("users")
        .update({ balance: newBalance })
        .eq("username", username);

    if (error) throw error;

    await createHistoryLog(userData.id, amount, reason);

    return { ...userData, balance: newBalance };
}

export async function createHistoryLog(
    userId: string,
    change: number,
    reason: string
) {
    const { error } = await supabase
        .from("history")
        .insert({ user_id: userId, change, reason });

    if (error) throw error;
    return true;
}

export async function fetchHistoryByUsername(
    username: string,
    limit: number = 20,
    offset: number = 0
) {
    const userData = await fetchUserByUsername(username);

    const { data, error } = await supabase
        .from("history")
        .select("*")
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
}