import { describe, it, expect, vi, beforeEach } from "vitest";
import { transferBalance } from "@/lib/server/services/transfer";
import { dbGetUser, dbUpdateUserBalance } from "@/lib/server/db/users";
import { dbInsertHistory } from "@/lib/server/db/history";
import { AppError, Errors } from "@/lib/server/error";
import { TRANSFER_MIN, TRANSFER_MAX } from "@/lib/config";
import { HistoryReason } from "@/types/models";
import { mockUser } from "@/tests/helpers/mocks";

vi.mock("@/lib/server/db/users");
vi.mock("@/lib/server/db/history");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("transferBalance", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("throws TRANSFER_LIMIT when the amount is below the minimum", async () => {
        await expect(transferBalance("user-1", "username2", TRANSFER_MIN - 1)).rejects.toThrow(
            new AppError(Errors.TRANSFER_LIMIT).code,
        );

        expect(dbGetUser).not.toHaveBeenCalled();
    });

    it("throws TRANSFER_LIMIT when the amount is above the maximum", async () => {
        await expect(transferBalance("user-1", "username2", TRANSFER_MAX + 1)).rejects.toThrow(
            new AppError(Errors.TRANSFER_LIMIT).code,
        );

        expect(dbGetUser).not.toHaveBeenCalled();
    });

    it("throws SELF_TRANSFER when transferring to oneself", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(
            mockUser(1, { id: "user-1", username: "username1", balance: 500 }),
        );

        await expect(transferBalance("user-1", "username1", 100)).rejects.toThrow(
            new AppError(Errors.SELF_TRANSFER).code,
        );
    });

    it("throws INSUFFICIENT_BALANCE when the sender cannot cover the amount", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(
            mockUser(1, { id: "user-1", username: "username1", balance: 50 }),
        );

        await expect(transferBalance("user-1", "username2", 100)).rejects.toThrow(
            new AppError(Errors.INSUFFICIENT_BALANCE).code,
        );
    });

    it("moves the amount from the sender to the receiver and records history", async () => {
        vi.mocked(dbGetUser)
            .mockResolvedValueOnce(mockUser(1, { id: "user-1", username: "username1", balance: 500 }))
            .mockResolvedValueOnce(mockUser(2, { id: "user-2", username: "username2", balance: 200 }));
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);

        const result = await transferBalance("user-1", "username2", 100);

        expect(result).toEqual({ transferred: 100, balance: 400 });
        expect(dbUpdateUserBalance).toHaveBeenCalledWith("user-1", 400);
        expect(dbUpdateUserBalance).toHaveBeenCalledWith("user-2", 300);
        expect(dbInsertHistory).toHaveBeenCalledWith(
            "user-1", -100, HistoryReason.Transfer.SENT, { player: "username2" },
        );
        expect(dbInsertHistory).toHaveBeenCalledWith(
            "user-2", 100, HistoryReason.Transfer.RECEIVED, { player: "username1" },
        );
    });
});