import { describe, it, expect, vi, beforeEach } from "vitest";
import { transferBalance } from "@/lib/server/services/transfer";
import { AppError, Errors } from "@/lib/server/error";
import { TRANSFER_MIN, TRANSFER_MAX } from "@/lib/config";

vi.mock("@/lib/server/db/users", () => ({
    dbGetUser: vi.fn(),
    dbUpdateUserBalance: vi.fn(),
}));

vi.mock("@/lib/server/db/history", () => ({
    dbInsertHistory: vi.fn(),
}));

import { dbGetUser, dbUpdateUserBalance } from "@/lib/server/db/users";
import { dbInsertHistory } from "@/lib/server/db/history";

const mockSender = { id: "user-123", username: "user1", balance: 500, password: "hashed", created_at: "2024-01-01" };
const mockReceiver = { id: "user-456", username: "user2", balance: 200, password: "hashed", created_at: "2024-01-01" };

describe("transferBalance", () => {
    beforeEach(() => vi.clearAllMocks());

    it("throws TRANSFER_LIMIT if amount is below minimum", async () => {
        await expect(
            transferBalance("user-123", "user2", TRANSFER_MIN - 1)
        ).rejects.toMatchObject({ code: Errors.TRANSFER_LIMIT.code });
    });

    it("throws TRANSFER_LIMIT if amount is above maximum", async () => {
        await expect(
            transferBalance("user-123", "user2", TRANSFER_MAX + 1)
        ).rejects.toMatchObject({ code: Errors.TRANSFER_LIMIT.code });
    });

    it("throws SELF_TRANSFER if sending to self", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(mockSender);
        await expect(
            transferBalance("user-123", "user1", TRANSFER_MIN)
        ).rejects.toMatchObject({ code: Errors.SELF_TRANSFER.code });
    });

    it("throws INSUFFICIENT_BALANCE if sender balance is too low", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce({ ...mockSender, balance: 0 });
        await expect(
            transferBalance("user-123", "user2", TRANSFER_MIN)
        ).rejects.toMatchObject({ code: Errors.INSUFFICIENT_BALANCE.code });
    });

    it("transfers amount and updates both balances", async () => {
        vi.mocked(dbGetUser)
            .mockResolvedValueOnce(mockSender)
            .mockResolvedValueOnce(mockReceiver);
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);

        const result = await transferBalance("user-123", "user2", 100);

        expect(result.transferred).toBe(100);
        expect(result.balance).toBe(mockSender.balance - 100);
        expect(dbUpdateUserBalance).toHaveBeenCalledTimes(2);
        expect(dbInsertHistory).toHaveBeenCalledTimes(2);
    });

    it("inserts history for both sender and receiver", async () => {
        vi.mocked(dbGetUser)
            .mockResolvedValueOnce(mockSender)
            .mockResolvedValueOnce(mockReceiver);
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);

        await transferBalance("user-123", "user2", 100);

        expect(dbInsertHistory).toHaveBeenCalledWith("user-123", -100, "TRANSFER:SENT", { player: "user2" });
        expect(dbInsertHistory).toHaveBeenCalledWith("user-456", 100, "TRANSFER:RECEIVED", { player: "user1" });
    });
});