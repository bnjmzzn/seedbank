import { dbGetUser, dbUpdateUserBalance } from "@/lib/server/db/users";
import { dbCreateHistoryEntry } from "@/lib/server/db/history";
import { dbCreateStealEntry } from "@/lib/server/db/steal";
import { AppError, Errors } from "@/lib/server/error";
import { STEAL_SUCCESS_PERCENT, STEAL_MIN, STEAL_MAX } from "@/lib/config";
import { HistoryReason } from "@/types/database";

export async function stealSeeds(
    stealerId: string,
    fromUsername: string,
    amount: number
): Promise<{ success: boolean; delta: number; balance: number }> {

    if (amount < STEAL_MIN || amount > STEAL_MAX)
        throw new AppError(Errors.STEAL_LIMIT);

    const stealer = await dbGetUser("id", stealerId);

    if (stealer.username === fromUsername)
        throw new AppError(Errors.SELF_STEAL);

    if (stealer.balance! < amount)
        throw new AppError(Errors.INSUFFICIENT_BALANCE);

    const target = await dbGetUser("username", fromUsername);

    if (target.balance! < amount)
        throw new AppError(Errors.INSUFFICIENT_BALANCE);

    const success = Math.random() < STEAL_SUCCESS_PERCENT / 100;

    const stealerDelta = success ? amount : -amount;
    const targetDelta = success ? -amount : amount;

    const stealerBalance = stealer.balance! + stealerDelta;
    const targetBalance = target.balance! + targetDelta;

    await dbUpdateUserBalance(stealerId, stealerBalance);
    await dbUpdateUserBalance(target.id, targetBalance);
    await dbCreateHistoryEntry(stealerId, stealerDelta, stealerDelta > 0 ? HistoryReason.Steal.CREDIT : HistoryReason.Steal.DEBIT);
    await dbCreateHistoryEntry(target.id, targetDelta, targetDelta > 0 ? HistoryReason.Steal.CREDIT : HistoryReason.Steal.DEBIT);
    await dbCreateStealEntry(stealerId, target.id, amount, success);

    return { success, delta: stealerDelta, balance: stealerBalance };
}