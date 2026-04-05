import { dbGetUser, dbUpdateUserBalance } from "@/lib/server/db/users";
import { dbInsertHistory } from "@/lib/server/db/history";
import { AppError, Errors } from "@/lib/server/error";
import { GUARANTEED_LOSS_BET, WIN_RATE_PERCENT, BET_MIN } from "@/lib/config";
import { HistoryReason } from "@/types/database";

function getWinRate(bet: number): number {
    return Math.max(0, (WIN_RATE_PERCENT / 100) * (1 - bet / GUARANTEED_LOSS_BET));
}

export async function playGame(
    userId: string,
    game: HistoryReason.Game,
    bet: number
): Promise<{ won: boolean; delta: number; balance: number }> {
    
    if (bet < BET_MIN) throw new AppError(Errors.INVALID_BODY);

    const user = await dbGetUser("id", userId);
    if (user.balance! < bet) throw new AppError(Errors.INSUFFICIENT_BALANCE);

    const won = Math.random() < getWinRate(bet);
    const delta = won ? bet : -bet;
    const newBalance = user.balance! + delta;

    await Promise.all([
        dbUpdateUserBalance(userId, newBalance),
        dbInsertHistory(userId, delta, game),
    ]);

    return { won, delta, balance: newBalance };
}