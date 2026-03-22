import { dbGetTopBalances } from "@/lib/server/db/leaderboard";
import type { LeaderboardEntry } from "@/types/database";

export async function getBalanceLeaderboard(): Promise<LeaderboardEntry[]> {
    const rows = await dbGetTopBalances();

    return rows.map((row, index) => ({
        rank: index + 1,
        username: row.username,
        balance: row.balance ?? 0,
    }));
}