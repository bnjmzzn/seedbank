import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBalanceLeaderboard } from "@/lib/server/services/leaderboard";
import { dbGetTopUsers } from "@/lib/server/db/users";
import { LEADERBOARD_LIMIT } from "@/lib/config";
import { mockUser } from "@/tests/helpers/mocks";

vi.mock("@/lib/server/db/users");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("getBalanceLeaderboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("requests the top users using the configured limit", async () => {
        vi.mocked(dbGetTopUsers).mockResolvedValue([]);

        await getBalanceLeaderboard();

        expect(dbGetTopUsers).toHaveBeenCalledWith(LEADERBOARD_LIMIT);
    });

    it("maps users to ranked leaderboard entries in order", async () => {
        const users = [
            mockUser(1, { username: "username1", balance: 5000 }),
            mockUser(2, { username: "username2", balance: 3000 }),
            mockUser(3, { username: "username3", balance: 1000 }),
        ];
        vi.mocked(dbGetTopUsers).mockResolvedValue(users);

        const result = await getBalanceLeaderboard();

        expect(result).toEqual([
            { rank: 1, username: "username1", balance: 5000 },
            { rank: 2, username: "username2", balance: 3000 },
            { rank: 3, username: "username3", balance: 1000 },
        ]);
    });

    it("defaults balance to zero when missing", async () => {
        const users = [mockUser(1, { username: "username1", balance: undefined })];
        vi.mocked(dbGetTopUsers).mockResolvedValue(users);

        const result = await getBalanceLeaderboard();

        expect(result).toEqual([{ rank: 1, username: "username1", balance: 0 }]);
    });

    it("returns an empty array when there are no users", async () => {
        vi.mocked(dbGetTopUsers).mockResolvedValue([]);

        const result = await getBalanceLeaderboard();

        expect(result).toEqual([]);
    });
});