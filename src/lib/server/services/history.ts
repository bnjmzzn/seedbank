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
        .filter((v): v is string => v.includes(":"))
        .map(v => v.split(":")[0])
);

export const VALID_FILTER = new Set<string>([...VALID_TYPES, ...VALID_PREFIXES]);

export async function getUserHistory(
    username: string,
    filters: { type?: string; limit?: number } = {}
): Promise<HistoryRow[]> {
    const rawLimit = filters.limit ?? HISTORY_DEFAULT_LIMIT;
    const safeLimit = Math.min(Math.max(1, Number.isNaN(rawLimit) ? HISTORY_DEFAULT_LIMIT : rawLimit), HISTORY_MAX_LIMIT);

    const user = await dbGetUser("username", username);
    const isPrefixFilter = filters.type ? VALID_PREFIXES.has(filters.type) : false;

    return dbGetHistory({
        userId: user.id,
        reason: !isPrefixFilter ? filters.type : undefined,
        reasonLike: isPrefixFilter ? filters.type : undefined,
        limit: safeLimit,
    });
}