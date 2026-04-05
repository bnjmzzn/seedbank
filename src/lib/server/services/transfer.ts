import { dbGetUser, dbUpdateUserBalance } from "@/lib/server/db/users";
import { dbInsertHistory } from "@/lib/server/db/history";
import { AppError, Errors } from "@/lib/server/error";
import { TRANSFER_MIN, TRANSFER_MAX } from "@/lib/config";
import { HistoryReason } from "@/types/database";

export async function transferBalance(
    senderId: string,
    toUsername: string,
    amount: number
): Promise<{ transferred: number; balance: number }> {

    if (amount < TRANSFER_MIN || amount > TRANSFER_MAX)
        throw new AppError(Errors.TRANSFER_LIMIT);

    const sender = await dbGetUser("id", senderId);
    if (sender.username === toUsername) throw new AppError(Errors.SELF_TRANSFER);
    if (sender.balance! < amount) throw new AppError(Errors.INSUFFICIENT_BALANCE);

    const receiver = await dbGetUser("username", toUsername);
    const senderBalance = sender.balance! - amount;
    const receiverBalance = receiver.balance! + amount;

    await Promise.all([
        dbUpdateUserBalance(senderId, senderBalance),
        dbUpdateUserBalance(receiver.id, receiverBalance),
        dbInsertHistory(senderId, -amount, HistoryReason.Transfer.SENT, { player: receiver.username }),
        dbInsertHistory(receiver.id, amount, HistoryReason.Transfer.RECEIVED, { player: sender.username }),
    ]);

    return { transferred: amount, balance: senderBalance };
}