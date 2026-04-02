import { dbGetUser } from "@/lib/server/db/users";
import { dbGetHistory } from "@/lib/server/db/history";
import { HISTORY_DEFAULT_LIMIT, HISTORY_MAX_LIMIT } from "@/lib/config";
import type { HistoryRow } from "@/types/database";

export async function getUserHistory(
    username: string,
    limit?: number
): Promise<HistoryRow[]> {
    
    const safeLimit = Math.min(
        Math.max(1, Number.isNaN(limit) ? HISTORY_DEFAULT_LIMIT : limit ?? HISTORY_DEFAULT_LIMIT),
        HISTORY_MAX_LIMIT
    );

    const user = await dbGetUser("username", username);
    return dbGetHistory({ userId: user.id, limit: safeLimit });
}