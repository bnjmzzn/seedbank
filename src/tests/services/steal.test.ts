import { describe, it, expect, vi, beforeEach } from "vitest";
import { stealBalance } from "@/lib/server/services/steal";
import { dbGetUser, dbUpdateUserBalance } from "@/lib/server/db/users";
import { dbInsertHistory } from "@/lib/server/db/history";
import { AppError, Errors } from "@/lib/server/error";
import { STEAL_SUCCESS_PERCENT, STEAL_MIN, STEAL_MAX } from "@/lib/config";
import { HistoryReason } from "@/types/models";
import { mockUser } from "@/tests/helpers/mocks";

vi.mock("@/lib/server/db/users");
vi.mock("@/lib/server/db/history");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("stealBalance", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("throws STEAL_LIMIT when the amount is below the minimum", async () => {
        await expect(stealBalance("user-1", "username2", STEAL_MIN - 1)).rejects.toThrow(
            new AppError(Errors.STEAL_LIMIT).code,
        );

        expect(dbGetUser).not.toHaveBeenCalled();
    });

    it("throws STEAL_LIMIT when the amount is above the maximum", async () => {
        await expect(stealBalance("user-1", "username2", STEAL_MAX + 1)).rejects.toThrow(
            new AppError(Errors.STEAL_LIMIT).code,
        );

        expect(dbGetUser).not.toHaveBeenCalled();
    });

    it("throws SELF_STEAL when stealing from oneself", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(
            mockUser(1, { id: "user-1", username: "username1", balance: 500 }),
        );

        await expect(stealBalance("user-1", "username1", 100)).rejects.toThrow(
            new AppError(Errors.SELF_STEAL).code,
        );
    });

    it("throws INSUFFICIENT_BALANCE when the stealer cannot cover the amount", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(
            mockUser(1, { id: "user-1", username: "username1", balance: 50 }),
        );

        await expect(stealBalance("user-1", "username2", 100)).rejects.toThrow(
            new AppError(Errors.INSUFFICIENT_BALANCE).code,
        );
    });

    it("throws INSUFFICIENT_BALANCE when the target cannot cover the amount", async () => {
        vi.mocked(dbGetUser)
            .mockResolvedValueOnce(mockUser(1, { id: "user-1", username: "username1", balance: 500 }))
            .mockResolvedValueOnce(mockUser(2, { id: "user-2", username: "username2", balance: 50 }));

        await expect(stealBalance("user-1", "username2", 100)).rejects.toThrow(
            new AppError(Errors.INSUFFICIENT_BALANCE).code,
        );
    });

    it("transfers the amount from the target to the stealer on success", async () => {
        vi.mocked(dbGetUser)
            .mockResolvedValueOnce(mockUser(1, { id: "user-1", username: "username1", balance: 500 }))
            .mockResolvedValueOnce(mockUser(2, { id: "user-2", username: "username2", balance: 500 }));
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);
        vi.spyOn(Math, "random").mockReturnValue(0);

        const result = await stealBalance("user-1", "username2", 100);

        expect(result).toEqual({ success: true, delta: 100, balance: 600 });
        expect(dbUpdateUserBalance).toHaveBeenCalledWith("user-1", 600);
        expect(dbUpdateUserBalance).toHaveBeenCalledWith("user-2", 400);
        expect(dbInsertHistory).toHaveBeenCalledWith(
            "user-1", 100, HistoryReason.Steal.ROBBER, { player: "username2" },
        );
        expect(dbInsertHistory).toHaveBeenCalledWith(
            "user-2", -100, HistoryReason.Steal.VICTIM, { player: "username1" },
        );

        vi.spyOn(Math, "random").mockRestore();
    });

    it("deducts the amount from the stealer and gives it to the target on failure", async () => {
        vi.mocked(dbGetUser)
            .mockResolvedValueOnce(mockUser(1, { id: "user-1", username: "username1", balance: 500 }))
            .mockResolvedValueOnce(mockUser(2, { id: "user-2", username: "username2", balance: 500 }));
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);
        vi.spyOn(Math, "random").mockReturnValue(0.999);

        const result = await stealBalance("user-1", "username2", 100);

        expect(result).toEqual({ success: false, delta: -100, balance: 400 });
        expect(dbUpdateUserBalance).toHaveBeenCalledWith("user-1", 400);
        expect(dbUpdateUserBalance).toHaveBeenCalledWith("user-2", 600);
        expect(dbInsertHistory).toHaveBeenCalledWith(
            "user-1", -100, HistoryReason.Steal.ROBBER, { player: "username2" },
        );
        expect(dbInsertHistory).toHaveBeenCalledWith(
            "user-2", 100, HistoryReason.Steal.VICTIM, { player: "username1" },
        );

        vi.spyOn(Math, "random").mockRestore();
    });

    it("gives close to the configured success rate when the roll lands near the boundary", async () => {
        vi.mocked(dbGetUser)
            .mockResolvedValueOnce(mockUser(1, { id: "user-1", username: "username1", balance: 500 }))
            .mockResolvedValueOnce(mockUser(2, { id: "user-2", username: "username2", balance: 500 }));
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);

        const successBoundary = STEAL_SUCCESS_PERCENT / 100;

        vi.spyOn(Math, "random").mockReturnValueOnce(successBoundary - 0.0001);
        const successResult = await stealBalance("user-1", "username2", 100);
        expect(successResult.success).toBe(true);

        vi.spyOn(Math, "random").mockRestore();
    });
});