import { dbGetUser } from "@/lib/server/db/users";
import { dbGetUserHistory } from "@/lib/server/db/history";
import type { HistoryRow } from "@/types/database";
import { HISTORY_DEFAULT_LIMIT, HISTORY_MAX_LIMIT } from "../../config";

export async function getUserHistory(
    username: string,
    limit: number,
    offset: number
): Promise<Omit<HistoryRow, "id" | "user_id">[]> {

    const safeLimit = Math.min(
        Math.max(1, Number.isNaN(limit) ? HISTORY_DEFAULT_LIMIT : limit),
        HISTORY_MAX_LIMIT
    );
    const safeOffset = Number.isNaN(offset) ? 0 : Math.max(0, offset);

    const user = await dbGetUser("username", username);
    return dbGetUserHistory(user.id, safeLimit, safeOffset);
}