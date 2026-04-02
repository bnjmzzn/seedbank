import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/(api)/api/leaderboard/route";

vi.mock("@/lib/server/services/leaderboard", () => ({
    getBalanceLeaderboard: vi.fn(),
}));

import { getBalanceLeaderboard } from "@/lib/server/services/leaderboard";

describe("GET /api/leaderboard", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns 200 with leaderboard data", async () => {
        vi.mocked(getBalanceLeaderboard).mockResolvedValueOnce([
            { rank: 1, username: "alice", balance: 1000 },
            { rank: 2, username: "bob", balance: 500 },
        ]);

        const res = await GET();
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.data).toHaveLength(2);
        expect(body.data[0].rank).toBe(1);
    });

    it("returns 500 if service throws unexpectedly", async () => {
        vi.mocked(getBalanceLeaderboard).mockRejectedValueOnce(new Error("db exploded"));
        const res = await GET();
        expect(res.status).toBe(500);
    });
});