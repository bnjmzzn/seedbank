import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDailyStatus, claimDaily } from "@/lib/server/services/daily";
import { AppError, Errors } from "@/lib/server/error";
import { DAILY_AMOUNT, DAILY_COOLDOWN_MS } from "@/lib/config";
import type { HistoryRow } from "@/types/db";

vi.mock("@/lib/server/db/users", () => ({
    dbGetUser: vi.fn(),
    dbUpdateUserBalance: vi.fn(),
}));

vi.mock("@/lib/server/db/history", () => ({
    dbGetHistory: vi.fn(),
    dbInsertHistory: vi.fn(),
}));

import { dbGetUser, dbUpdateUserBalance } from "@/lib/server/db/users";
import { dbGetHistory, dbInsertHistory } from "@/lib/server/db/history";

const mockUser = { id: "user-123", username: "user_one", balance: 500, password: "hashed", created_at: "2024-01-01" };

const recentClaim: HistoryRow = {
    change: 100,
    reason: "DAILY",
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
};

const oldClaim: HistoryRow = {
    change: 100,
    reason: "DAILY",
    created_at: new Date(Date.now() - DAILY_COOLDOWN_MS - 1000).toISOString(),
};

describe("getDailyStatus", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns claimable true if no history", async () => {
        vi.mocked(dbGetHistory).mockResolvedValueOnce([]);
        const result = await getDailyStatus("user-123");
        expect(result.claimable).toBe(true);
        expect(result.remaining).toBeNull();
    });

    it("returns claimable false if claimed within cooldown", async () => {
        vi.mocked(dbGetHistory).mockResolvedValueOnce([recentClaim]);
        const result = await getDailyStatus("user-123");
        expect(result.claimable).toBe(false);
        expect(result.remaining).toBeGreaterThan(0);
    });

    it("returns claimable true if last claim is older than cooldown", async () => {
        vi.mocked(dbGetHistory).mockResolvedValueOnce([oldClaim]);
        const result = await getDailyStatus("user-123");
        expect(result.claimable).toBe(true);
        expect(result.remaining).toBeNull();
    });
});

describe("claimDaily", () => {
    beforeEach(() => vi.clearAllMocks());

    it("credits DAILY_AMOUNT and updates balance", async () => {
        vi.mocked(dbGetHistory).mockResolvedValueOnce([]);
        vi.mocked(dbGetUser).mockResolvedValueOnce(mockUser);
        vi.mocked(dbUpdateUserBalance).mockResolvedValueOnce(undefined);
        vi.mocked(dbInsertHistory).mockResolvedValueOnce(undefined);

        const result = await claimDaily("user-123");

        expect(result.claimed).toBe(DAILY_AMOUNT);
        expect(result.balance).toBe(mockUser.balance + DAILY_AMOUNT);
        expect(dbUpdateUserBalance).toHaveBeenCalledWith("user-123", mockUser.balance + DAILY_AMOUNT);
        expect(dbInsertHistory).toHaveBeenCalledWith("user-123", DAILY_AMOUNT, "DAILY");
    });

    it("throws COOLDOWN_ACTIVE if already claimed", async () => {
        vi.mocked(dbGetHistory).mockResolvedValueOnce([recentClaim]);
        await expect(claimDaily("user-123")).rejects.toThrow(AppError);

        vi.mocked(dbGetHistory).mockResolvedValueOnce([recentClaim]);
        const err = await claimDaily("user-123").catch(e => e);
        expect(err.code).toBe(Errors.COOLDOWN_ACTIVE.code);
    });
});