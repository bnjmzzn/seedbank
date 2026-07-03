import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDailyStatus, claimDaily } from "@/lib/server/services/daily";
import { dbGetUser, dbUpdateUserBalance } from "@/lib/server/db/users";
import { dbInsertHistory, dbGetHistory } from "@/lib/server/db/history";
import { AppError, Errors } from "@/lib/server/error";
import { DAILY_AMOUNT, DAILY_COOLDOWN_MS } from "@/lib/config";
import { HistoryReason } from "@/types/models";
import { mockUser, mockHistoryRow } from "@/tests/helpers/mocks";

vi.mock("@/lib/server/db/users");
vi.mock("@/lib/server/db/history");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("getDailyStatus", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns claimable true when there is no previous claim", async () => {
        vi.mocked(dbGetHistory).mockResolvedValue([]);

        const result = await getDailyStatus("user-1");

        expect(result).toEqual({ claimable: true, remaining: null });
    });

    it("returns claimable false when the cooldown has not elapsed", async () => {
        const recentClaim = mockHistoryRow(1, {
            created_at: new Date(Date.now() - 1000).toISOString(),
        });
        vi.mocked(dbGetHistory).mockResolvedValue([recentClaim]);

        const result = await getDailyStatus("user-1");

        expect(result.claimable).toBe(false);
        expect(result.remaining).toBeGreaterThan(0);
    });

    it("returns claimable true when the cooldown has elapsed", async () => {
        const oldClaim = mockHistoryRow(1, {
            created_at: new Date(Date.now() - (DAILY_COOLDOWN_MS + 1000)).toISOString(),
        });
        vi.mocked(dbGetHistory).mockResolvedValue([oldClaim]);

        const result = await getDailyStatus("user-1");

        expect(result).toEqual({ claimable: true, remaining: null });
    });

    it("queries history filtered by the daily reason with a limit of one", async () => {
        vi.mocked(dbGetHistory).mockResolvedValue([]);

        await getDailyStatus("user-1");

        expect(dbGetHistory).toHaveBeenCalledWith({
            userId: "user-1",
            reason: HistoryReason.DAILY,
            limit: 1,
        });
    });
});

describe("claimDaily", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("throws COOLDOWN_ACTIVE when not claimable", async () => {
        const recentClaim = mockHistoryRow(1, {
            created_at: new Date(Date.now() - 1000).toISOString(),
        });
        vi.mocked(dbGetHistory).mockResolvedValue([recentClaim]);

        await expect(claimDaily("user-1")).rejects.toThrow(
            new AppError(Errors.COOLDOWN_ACTIVE).code,
        );

        expect(dbGetUser).not.toHaveBeenCalled();
    });

    it("adds the daily amount to the user balance and records history", async () => {
        vi.mocked(dbGetHistory).mockResolvedValue([]);
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1, { balance: 500 }));
        vi.mocked(dbUpdateUserBalance).mockResolvedValue(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValue(undefined);

        const result = await claimDaily("user-1");

        expect(result).toEqual({ claimed: DAILY_AMOUNT, balance: 500 + DAILY_AMOUNT });
        expect(dbUpdateUserBalance).toHaveBeenCalledWith("user-1", 500 + DAILY_AMOUNT);
        expect(dbInsertHistory).toHaveBeenCalledWith("user-1", DAILY_AMOUNT, HistoryReason.DAILY);
    });
});