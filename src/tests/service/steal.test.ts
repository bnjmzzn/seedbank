import { describe, it, expect, vi, beforeEach } from "vitest";
import { stealBalance } from "@/lib/server/services/steal";
import { Errors } from "@/lib/server/error";
import { STEAL_MIN, STEAL_MAX } from "@/lib/config";

vi.mock("@/lib/server/db/users", () => ({
    dbGetUser: vi.fn(),
    dbUpdateUserBalance: vi.fn(),
}));

vi.mock("@/lib/server/db/history", () => ({
    dbInsertHistory: vi.fn(),
}));

import { dbGetUser, dbUpdateUserBalance } from "@/lib/server/db/users";
import { dbInsertHistory } from "@/lib/server/db/history";

const mockStealer = { id: "user-123", username: "user1", balance: 500, password: "hashed", created_at: "2024-01-01" };
const mockTarget = { id: "user-456", username: "user2", balance: 500, password: "hashed", created_at: "2024-01-01" };

describe("stealBalance", () => {
    beforeEach(() => vi.clearAllMocks());

    it("throws STEAL_LIMIT if amount is below minimum", async () => {
        await expect(
            stealBalance("user-123", "user2", STEAL_MIN - 1)
        ).rejects.toMatchObject({ code: Errors.STEAL_LIMIT.code });
    });

    it("throws STEAL_LIMIT if amount is above maximum", async () => {
        await expect(
            stealBalance("user-123", "user2", STEAL_MAX + 1)
        ).rejects.toMatchObject({ code: Errors.STEAL_LIMIT.code });
    });

    it("throws SELF_STEAL if stealing from self", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(mockStealer);
        await expect(
            stealBalance("user-123", "user1", STEAL_MIN)
        ).rejects.toMatchObject({ code: Errors.SELF_STEAL.code });
    });

    it("throws INSUFFICIENT_BALANCE if stealer balance is too low", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce({ ...mockStealer, balance: 0 });
        await expect(
            stealBalance("user-123", "user2", STEAL_MIN)
        ).rejects.toMatchObject({ code: Errors.INSUFFICIENT_BALANCE.code });
    });

    it("throws INSUFFICIENT_BALANCE if target balance is too low", async () => {
        vi.mocked(dbGetUser)
            .mockResolvedValueOnce(mockStealer)
            .mockResolvedValueOnce({ ...mockTarget, balance: 0 });
        await expect(
            stealBalance("user-123", "user2", STEAL_MIN)
        ).rejects.toMatchObject({ code: Errors.INSUFFICIENT_BALANCE.code });
    });

    it("credits stealer and debits target on success", async () => {
        vi.mocked(dbGetUser)
            .mockResolvedValueOnce(mockStealer)
            .mockResolvedValueOnce(mockTarget);
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);
        vi.spyOn(Math, "random").mockReturnValueOnce(0);

        const result = await stealBalance("user-123", "user2", 100);

        expect(result.success).toBe(true);
        expect(result.delta).toBe(100);
        expect(result.balance).toBe(mockStealer.balance + 100);
        expect(dbUpdateUserBalance).toHaveBeenCalledTimes(2);
        expect(dbInsertHistory).toHaveBeenCalledTimes(2);
    });

    it("debits stealer and credits target on failure", async () => {
        vi.mocked(dbGetUser)
            .mockResolvedValueOnce(mockStealer)
            .mockResolvedValueOnce(mockTarget);
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);
        vi.spyOn(Math, "random").mockReturnValueOnce(1);

        const result = await stealBalance("user-123", "user2", 100);

        expect(result.success).toBe(false);
        expect(result.delta).toBe(-100);
        expect(result.balance).toBe(mockStealer.balance - 100);
    });

    it("inserts history for both stealer and target", async () => {
        vi.mocked(dbGetUser)
            .mockResolvedValueOnce(mockStealer)
            .mockResolvedValueOnce(mockTarget);
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);
        vi.spyOn(Math, "random").mockReturnValueOnce(0);

        await stealBalance("user-123", "user2", 100);

        expect(dbInsertHistory).toHaveBeenCalledWith("user-123", 100, "STEAL:ROBBER", { player: "user2" });
        expect(dbInsertHistory).toHaveBeenCalledWith("user-456", -100, "STEAL:VICTIM", { player: "user1" });
    });
});