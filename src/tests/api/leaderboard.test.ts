import { describe, vi, expect, it, beforeEach } from "vitest";
import { GET } from "@/app/(api)/api/leaderboard/route";
import { getBalanceLeaderboard } from "@/lib/server/services/leaderboard";
import { makeRequest } from "@/tests/helpers/requests";
import { expectInternalErrorResponse, expectSuccessResponse } from "@/tests/helpers/routeAssertions";

vi.mock("@/lib/server/services/leaderboard");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("GET /api/leaderboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("converts an unexpected error into an INTERNAL_ERROR response", async () => {
        vi.mocked(getBalanceLeaderboard).mockRejectedValue(new Error("connection lost"));

        const response = await GET();

        await expectInternalErrorResponse(response);
    });

    it("returns the leaderboard entries on success", async () => {
        const entries = [
            { rank: 1, username: "username1", balance: 5000 },
            { rank: 2, username: "username2", balance: 3000 },
        ];
        vi.mocked(getBalanceLeaderboard).mockResolvedValue(entries);

        const response = await GET();

        await expectSuccessResponse(response, entries);
    });

    it("returns an empty array when there are no users", async () => {
        vi.mocked(getBalanceLeaderboard).mockResolvedValue([]);

        const response = await GET();

        await expectSuccessResponse(response, []);
    });
});