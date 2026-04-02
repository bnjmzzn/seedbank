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

    await dbUpdateUserBalance(senderId, senderBalance);
    await dbUpdateUserBalance(receiver.id, receiverBalance);
    await dbInsertHistory(senderId, -amount, HistoryReason.Transfer.SEND, { counterparty_id: receiver.id });
    await dbInsertHistory(receiver.id, amount, HistoryReason.Transfer.RECEIVE, { counterparty_id: sender.id });

    return { transferred: amount, balance: senderBalance };
}