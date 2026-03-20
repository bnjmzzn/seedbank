import { dbGetUser } from "@/lib/db/users";
import { dbGetUserHistory } from "@/lib/db/history";
import type { HistoryRow } from "@/types/database";
import { HISTORY_DEFAULT_LIMIT, HISTORY_MAX_LIMIT } from "../config";

export async function getUserHistory(
    username: string,
    limit: number,
    offset: number
): Promise<Omit<HistoryRow, "id" | "user_id">[]> {

    const safeLimit = Math.min(Math.max(1, limit || HISTORY_DEFAULT_LIMIT), HISTORY_MAX_LIMIT);
    const safeOffset = Math.max(0, offset || 0);

    const user = await dbGetUser("username", username);
    return dbGetUserHistory(user.id, safeLimit, safeOffset);
}