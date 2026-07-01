import { describe, it, expect, vi, beforeEach } from "vitest";
import { playGame } from "@/lib/server/services/game";
import { dbGetUser, dbUpdateUserBalance } from "@/lib/server/db/users";
import { dbInsertHistory } from "@/lib/server/db/history";
import { AppError, Errors } from "@/lib/server/error";
import { GUARANTEED_LOSS_BET, WIN_RATE_PERCENT, BET_MIN } from "@/lib/config";
import { HistoryReason } from "@/types/models";
import { mockUser } from "@/tests/helpers/mocks";

vi.mock("@/lib/server/db/users");
vi.mock("@/lib/server/db/history");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("playGame", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("throws INVALID_BODY when the bet is below the minimum", async () => {
        await expect(playGame("user-1", HistoryReason.Game.COINFLIP, BET_MIN - 1)).rejects.toThrow(
            new AppError(Errors.INVALID_BODY).code,
        );

        expect(dbGetUser).not.toHaveBeenCalled();
    });

    it("throws INSUFFICIENT_BALANCE when the user cannot cover the bet", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1, { balance: 50 }));

        await expect(playGame("user-1", HistoryReason.Game.COINFLIP, 100)).rejects.toThrow(
            new AppError(Errors.INSUFFICIENT_BALANCE).code,
        );

        expect(dbUpdateUserBalance).not.toHaveBeenCalled();
    });

    it("increases the balance and records a positive history entry on a win", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1, { balance: 500 }));
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);
        vi.spyOn(Math, "random").mockReturnValue(0);

        const result = await playGame("user-1", HistoryReason.Game.COINFLIP, 100);

        expect(result).toEqual({ won: true, delta: 100, balance: 600 });
        expect(dbUpdateUserBalance).toHaveBeenCalledWith("user-1", 600);
        expect(dbInsertHistory).toHaveBeenCalledWith("user-1", 100, HistoryReason.Game.COINFLIP);

        vi.spyOn(Math, "random").mockRestore();
    });

    it("decreases the balance and records a negative history entry on a loss", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1, { balance: 500 }));
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);
        vi.spyOn(Math, "random").mockReturnValue(0.999);

        const result = await playGame("user-1", HistoryReason.Game.COINFLIP, 100);

        expect(result).toEqual({ won: false, delta: -100, balance: 400 });
        expect(dbUpdateUserBalance).toHaveBeenCalledWith("user-1", 400);
        expect(dbInsertHistory).toHaveBeenCalledWith("user-1", -100, HistoryReason.Game.COINFLIP);

        vi.spyOn(Math, "random").mockRestore();
    });

    it("never grants a win when the bet equals the guaranteed loss threshold", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1, { balance: GUARANTEED_LOSS_BET * 2 }));
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);
        vi.spyOn(Math, "random").mockReturnValue(0);

        const result = await playGame("user-1", HistoryReason.Game.COINFLIP, GUARANTEED_LOSS_BET);

        expect(result.won).toBe(false);

        vi.spyOn(Math, "random").mockRestore();
    });

    it("gives close to the configured win rate for a small bet", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1, { balance: 1000 }));
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);

        const justBelowWinRate = WIN_RATE_PERCENT / 100 - 0.0001;
        const justAboveWinRate = WIN_RATE_PERCENT / 100 + 0.0001;

        vi.spyOn(Math, "random").mockReturnValueOnce(justBelowWinRate);
        const winResult = await playGame("user-1", HistoryReason.Game.COINFLIP, BET_MIN);
        expect(winResult.won).toBe(true);

        vi.spyOn(Math, "random").mockReturnValueOnce(justAboveWinRate);
        const lossResult = await playGame("user-1", HistoryReason.Game.COINFLIP, BET_MIN);
        expect(lossResult.won).toBe(false);

        vi.spyOn(Math, "random").mockRestore();
    });
});