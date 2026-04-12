import { dbGetUser } from "@/lib/server/db/users";
import { dbGetHistory } from "@/lib/server/db/history";
import { HISTORY_DEFAULT_LIMIT, HISTORY_MAX_LIMIT } from "@/lib/config";
import { HistoryReason } from "@/types/models";
import type { HistoryRow } from "@/types/db";

const VALID_TYPES = new Set<string>([
    HistoryReason.DAILY,
    ...Object.values(HistoryReason.Game),
    ...Object.values(HistoryReason.Transfer),
    ...Object.values(HistoryReason.Steal),
]);

const VALID_PREFIXES = new Set<string>(
    [...VALID_TYPES]
        .filter((v): v is string => typeof v === "string" && v.includes(":"))
        .map(v => v.split(":")[0])
);

export const VALID_FILTER = new Set<string>([...VALID_TYPES, ...VALID_PREFIXES]);

export async function getUserHistory(
    username: string,
    filters: {
        type?: string;
        limit?: number;
    } = {}
): Promise<HistoryRow[]> {
    const safeLimit = Math.min(
        Math.max(1, Number.isNaN(filters.limit) ? HISTORY_DEFAULT_LIMIT : filters.limit ?? HISTORY_DEFAULT_LIMIT),
        HISTORY_MAX_LIMIT
    );

    const user = await dbGetUser("username", username);
    return dbGetHistory({
        userId: user.id,
        reason: filters.type ? `${filters.type}%` : undefined,
        limit: safeLimit,
    });
}