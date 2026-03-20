import { dbGetUser, dbUpdateUserBalance } from "@/lib/db/user";
import { dbGetLastDailyClaim, dbCreateHistoryEntry } from "@/lib/db/history";
import { AppError, Errors } from "@/lib/error";
import { DAILY_AMOUNT } from "@/lib/config";
import { HistoryReason } from "@/types/database";

export async function claimDaily(
    userId: string
): Promise<{ claimed: number; balance: number }> {

    const lastClaim = await dbGetLastDailyClaim(userId);

    if (lastClaim) {
        const diff = Date.now() - new Date(lastClaim.created_at!).getTime();
        const remaining = 24 * 60 * 60 * 1000 - diff;

        if (remaining > 0) throw new AppError(Errors.COOLDOWN_ACTIVE, { remaining });
    }

    const user = await dbGetUser("id", userId);
    const newBalance = user.balance! + DAILY_AMOUNT;

    await dbUpdateUserBalance(userId, newBalance);
    await dbCreateHistoryEntry(userId, DAILY_AMOUNT, HistoryReason.DAILY);

    return { claimed: DAILY_AMOUNT, balance: newBalance };
}