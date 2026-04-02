import { dbGetUser, dbUpdateUserBalance } from "@/lib/server/db/users";
import { dbInsertHistory, dbGetHistory } from "@/lib/server/db/history";
import { AppError, Errors } from "@/lib/server/error";
import { DAILY_AMOUNT } from "@/lib/config";
import { HistoryReason } from "@/types/database";

export async function claimDaily(
    userId: string
): Promise<{ claimed: number; balance: number }> {
    
    const [lastClaim] = await dbGetHistory({
        userId,
        reason: HistoryReason.DAILY,
        limit: 1,
    });

    if (lastClaim) {
        const diff = Date.now() - new Date(lastClaim.created_at!).getTime();
        const remaining = 24 * 60 * 60 * 1000 - diff;
        if (remaining > 0) throw new AppError(Errors.COOLDOWN_ACTIVE, { remaining });
    }

    const user = await dbGetUser("id", userId);
    const newBalance = user.balance! + DAILY_AMOUNT;

    await dbUpdateUserBalance(userId, newBalance);
    await dbInsertHistory(userId, DAILY_AMOUNT, HistoryReason.DAILY);

    return { claimed: DAILY_AMOUNT, balance: newBalance };
}