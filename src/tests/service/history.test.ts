import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserHistory } from "@/lib/server/services/history";
import { HISTORY_DEFAULT_LIMIT, HISTORY_MAX_LIMIT } from "@/lib/config";

vi.mock("@/lib/server/db/users", () => ({
    dbGetUser: vi.fn(),
}));

vi.mock("@/lib/server/db/history", () => ({
    dbGetHistory: vi.fn(),
}));

import { dbGetUser } from "@/lib/server/db/users";
import { dbGetHistory } from "@/lib/server/db/history";

const mockUser = { id: "user-123", username: "alice123", balance: 500, password: "hashed", created_at: "2024-01-01" };

describe("getUserHistory", () => {
    beforeEach(() => vi.clearAllMocks());

    it("uses default limit if none provided", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(mockUser);
        vi.mocked(dbGetHistory).mockResolvedValueOnce([]);

        await getUserHistory("alice123");

        expect(dbGetHistory).toHaveBeenCalledWith(
            expect.objectContaining({ limit: HISTORY_DEFAULT_LIMIT })
        );
    });

    it("clamps limit to HISTORY_MAX_LIMIT", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(mockUser);
        vi.mocked(dbGetHistory).mockResolvedValueOnce([]);

        await getUserHistory("alice123", { limit: 99999 });

        expect(dbGetHistory).toHaveBeenCalledWith(
            expect.objectContaining({ limit: HISTORY_MAX_LIMIT })
        );
    });

    it("clamps limit to 1 if below minimum", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(mockUser);
        vi.mocked(dbGetHistory).mockResolvedValueOnce([]);

        await getUserHistory("alice123", { limit: -5 });

        expect(dbGetHistory).toHaveBeenCalledWith(
            expect.objectContaining({ limit: 1 })
        );
    });

    it("uses exact reason for full type filter", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(mockUser);
        vi.mocked(dbGetHistory).mockResolvedValueOnce([]);

        await getUserHistory("alice123", { type: "GAME:COINFLIP" });

        expect(dbGetHistory).toHaveBeenCalledWith(
            expect.objectContaining({ reason: "GAME:COINFLIP", reasonLike: undefined })
        );
    });

    it("uses reasonLike for prefix filter", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(mockUser);
        vi.mocked(dbGetHistory).mockResolvedValueOnce([]);

        await getUserHistory("alice123", { type: "GAME" });

        expect(dbGetHistory).toHaveBeenCalledWith(
            expect.objectContaining({ reasonLike: "GAME", reason: undefined })
        );
    });

    it("passes no reason filter if type is not provided", async () => {
        vi.mocked(dbGetUser).mockResolvedValueOnce(mockUser);
        vi.mocked(dbGetHistory).mockResolvedValueOnce([]);

        await getUserHistory("alice123");

        expect(dbGetHistory).toHaveBeenCalledWith(
            expect.objectContaining({ reason: undefined, reasonLike: undefined })
        );
    });
});