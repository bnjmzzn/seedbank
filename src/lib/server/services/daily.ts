import { dbGetUser, dbUpdateUserBalance } from "@/lib/server/db/users";
import { dbInsertHistory, dbGetHistory } from "@/lib/server/db/history";
import { AppError, Errors } from "@/lib/server/error";
import { DAILY_AMOUNT } from "@/lib/config";
import { HistoryReason } from "@/types/database";

export async function getDailyStatus(
    userId: string
): Promise<{ claimable: boolean; remaining: number | null }> {
    const [lastClaim] = await dbGetHistory({
        userId,
        reason: HistoryReason.DAILY,
        limit: 1,
    });

    if (!lastClaim) return { claimable: true, remaining: null };

    const diff = Date.now() - new Date(lastClaim.created_at!).getTime();
    const remaining = 24 * 60 * 60 * 1000 - diff;

    return remaining > 0
        ? { claimable: false, remaining }
        : { claimable: true, remaining: null };
}

export async function claimDaily(
    userId: string
): Promise<{ claimed: number; balance: number }> {
    const { claimable, remaining } = await getDailyStatus(userId);
    if (!claimable) throw new AppError(Errors.COOLDOWN_ACTIVE, { remaining });

    const user = await dbGetUser("id", userId);
    const newBalance = user.balance! + DAILY_AMOUNT;

    await Promise.all([
        dbUpdateUserBalance(userId, newBalance),
        dbInsertHistory(userId, DAILY_AMOUNT, HistoryReason.DAILY),
    ]);

    return { claimed: DAILY_AMOUNT, balance: newBalance };
}