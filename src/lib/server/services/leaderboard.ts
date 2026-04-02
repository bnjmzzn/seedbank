import { dbGetTopUsers } from "@/lib/server/db/users";
import { LEADERBOARD_LIMIT } from "@/lib/config";
import type { LeaderboardEntry } from "@/types/database";

export async function getBalanceLeaderboard(): Promise<LeaderboardEntry[]> {
    const users = await dbGetTopUsers(LEADERBOARD_LIMIT);

    return users.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        balance: user.balance ?? 0,
    }));
}