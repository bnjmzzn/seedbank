import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserHistory, getHistoryById, VALID_FILTER } from "@/lib/server/services/history";
import { dbGetUser } from "@/lib/server/db/users";
import { dbGetHistory, dbGetHistoryById } from "@/lib/server/db/history";
import { HISTORY_DEFAULT_LIMIT, HISTORY_MAX_LIMIT } from "@/lib/config";
import { HistoryReason } from "@/types/models";
import { mockUser, mockHistoryRow } from "@/tests/helpers/mocks";

vi.mock("@/lib/server/db/users");
vi.mock("@/lib/server/db/history");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("VALID_FILTER", () => {
    it("includes top level reasons and game/transfer/steal prefixes", () => {
        expect(VALID_FILTER.has(HistoryReason.DAILY)).toBe(true);
        expect(VALID_FILTER.has(HistoryReason.Game.COINFLIP)).toBe(true);
        expect(VALID_FILTER.has("GAME")).toBe(true);
        expect(VALID_FILTER.has("TRANSFER")).toBe(true);
        expect(VALID_FILTER.has("STEAL")).toBe(true);
    });
});

describe("getUserHistory", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("looks up the user and queries history by their id", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1));
        vi.mocked(dbGetHistory).mockResolvedValue([]);

        await getUserHistory("username1");

        expect(dbGetUser).toHaveBeenCalledWith("username", "username1");
        expect(dbGetHistory).toHaveBeenCalledWith({
            userId: "user-1",
            reason: undefined,
            reasonLike: undefined,
            limit: HISTORY_DEFAULT_LIMIT,
        });
    });

    it("filters by exact reason when the type is not a prefix", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1));
        vi.mocked(dbGetHistory).mockResolvedValue([]);

        await getUserHistory("username1", { type: HistoryReason.DAILY });

        expect(dbGetHistory).toHaveBeenCalledWith({
            userId: "user-1",
            reason: HistoryReason.DAILY,
            reasonLike: undefined,
            limit: HISTORY_DEFAULT_LIMIT,
        });
    });

    it("filters by prefix when the type is a known prefix", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1));
        vi.mocked(dbGetHistory).mockResolvedValue([]);

        await getUserHistory("username1", { type: "GAME" });

        expect(dbGetHistory).toHaveBeenCalledWith({
            userId: "user-1",
            reason: undefined,
            reasonLike: "GAME",
            limit: HISTORY_DEFAULT_LIMIT,
        });
    });

    it("clamps the limit to the configured maximum", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1));
        vi.mocked(dbGetHistory).mockResolvedValue([]);

        await getUserHistory("username1", { limit: HISTORY_MAX_LIMIT + 9999 });

        expect(dbGetHistory).toHaveBeenCalledWith(
            expect.objectContaining({ limit: HISTORY_MAX_LIMIT }),
        );
    });

    it("clamps the limit to a minimum of one", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1));
        vi.mocked(dbGetHistory).mockResolvedValue([]);

        await getUserHistory("username1", { limit: -5 });

        expect(dbGetHistory).toHaveBeenCalledWith(
            expect.objectContaining({ limit: 1 }),
        );
    });

    it("falls back to the default limit when the provided limit is not a number", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1));
        vi.mocked(dbGetHistory).mockResolvedValue([]);

        await getUserHistory("username1", { limit: Number.NaN });

        expect(dbGetHistory).toHaveBeenCalledWith(
            expect.objectContaining({ limit: HISTORY_DEFAULT_LIMIT }),
        );
    });
});

describe("getHistoryById", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns history detail combined with the related username", async () => {
        const row = mockHistoryRow(1, { user_id: "user-1", change: 100, reason: "DAILY" });
        vi.mocked(dbGetHistoryById).mockResolvedValue(row);
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1, { username: "username1" }));

        const result = await getHistoryById("history-1");

        expect(result).toEqual({
            id: "history-1",
            username: "username1",
            change: 100,
            reason: "DAILY",
            meta: null,
            created_at: row.created_at,
        });
        expect(dbGetUser).toHaveBeenCalledWith("id", "user-1");
    });
});