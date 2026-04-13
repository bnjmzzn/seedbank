import { describe, it, expect, vi, beforeEach } from "vitest";
import { playGame } from "@/lib/server/services/game";
import { AppError, Errors } from "@/lib/server/error";
import { BET_MIN, BET_MAX } from "@/lib/config";
import { HistoryReason } from "@/types/models";

vi.mock("@/lib/server/db/users", () => ({
    dbGetUser: vi.fn(),
    dbUpdateUserBalance: vi.fn(),
}));

vi.mock("@/lib/server/db/history", () => ({
    dbInsertHistory: vi.fn(),
}));

import { dbGetUser, dbUpdateUserBalance } from "@/lib/server/db/users";
import { dbInsertHistory } from "@/lib/server/db/history";

const mockUser = { id: "user-123", username: "user1", balance: 500, password: "hashed", created_at: "2024-01-01" };

describe("playGame", () => {
    beforeEach(() => vi.clearAllMocks());

    it("throws INVALID_BODY if bet is below minimum", async () => {
        await expect(
            playGame("user-123", HistoryReason.Game.COINFLIP, BET_MIN - 1)
        ).rejects.toMatchObject({ code: Errors.INVALID_BODY.code });
    });

    it("throws INSUFFICIENT_BALANCE if balance is too low", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce({ ...mockUser, balance: 1 });
        await expect(
            playGame("user-123", HistoryReason.Game.COINFLIP, BET_MIN)
        ).rejects.toMatchObject({ code: Errors.INSUFFICIENT_BALANCE.code });
    });

    it("returns won and correct delta on win", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(mockUser);
        vi.mocked(dbUpdateUserBalance).mockResolvedValueOnce(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValueOnce(undefined);
        vi.spyOn(Math, "random").mockReturnValueOnce(0);

        const result = await playGame("user-123", HistoryReason.Game.COINFLIP, BET_MIN);

        expect(result.won).toBe(true);
        expect(result.delta).toBe(BET_MIN);
        expect(result.balance).toBe(mockUser.balance + BET_MIN);
    });

    it("returns lost and negative delta on loss", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(mockUser);
        vi.mocked(dbUpdateUserBalance).mockResolvedValueOnce(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValueOnce(undefined);
        vi.spyOn(Math, "random").mockReturnValueOnce(1);

        const result = await playGame("user-123", HistoryReason.Game.COINFLIP, BET_MIN);

        expect(result.won).toBe(false);
        expect(result.delta).toBe(-BET_MIN);
        expect(result.balance).toBe(mockUser.balance - BET_MIN);
    });

    it("always loses at BET_MAX", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce({ ...mockUser, balance: BET_MAX + 1 });
        vi.mocked(dbUpdateUserBalance).mockResolvedValueOnce(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValueOnce(undefined);
        vi.spyOn(Math, "random").mockReturnValueOnce(0);

        const result = await playGame("user-123", HistoryReason.Game.COINFLIP, BET_MAX);

        expect(result.won).toBe(false);
    });

    it("updates balance and inserts history on play", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(mockUser);
        vi.mocked(dbUpdateUserBalance).mockResolvedValueOnce(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValueOnce(undefined);
        vi.spyOn(Math, "random").mockReturnValueOnce(0);

        await playGame("user-123", HistoryReason.Game.COINFLIP, BET_MIN);

        expect(dbUpdateUserBalance).toHaveBeenCalledOnce();
        expect(dbInsertHistory).toHaveBeenCalledWith("user-123", BET_MIN, HistoryReason.Game.COINFLIP);
    });
});