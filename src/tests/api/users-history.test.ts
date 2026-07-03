import { describe, vi, expect, it, beforeEach } from "vitest";
import { GET } from "@/app/(api)/api/users/[username]/history/route";
import { getUserHistory } from "@/lib/server/services/history";
import { Errors } from "@/lib/server/error";
import { makeRequest, makeParams } from "@/tests/helpers/requests";
import { expectErrorResponse, expectInternalErrorResponse, expectSuccessResponse } from "@/tests/helpers/routeAssertions";
import { HISTORY_DEFAULT_LIMIT } from "@/lib/config";

vi.mock("@/lib/server/services/history", async () => {
    const actual = await vi.importActual<typeof import("@/lib/server/services/history")>(
        "@/lib/server/services/history",
    );

    return {
        ...actual,
        getUserHistory: vi.fn(),
    };
});
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("GET /api/users/[username]/history", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns INVALID_BODY when the type query param is not a recognized filter", async () => {
        const request = makeRequest({ method: "GET", searchParams: { type: "NOT_REAL" } });
        const response = await GET(request, makeParams({ username: "username1" }));

        await expectErrorResponse(response, Errors.INVALID_BODY);
        expect(getUserHistory).not.toHaveBeenCalled();
    });

    it("converts an unexpected error into an INTERNAL_ERROR response", async () => {
        vi.mocked(getUserHistory).mockRejectedValue(new Error("connection lost"));

        const request = makeRequest({ method: "GET" });
        const response = await GET(request, makeParams({ username: "username1" }));

        await expectInternalErrorResponse(response);
    });

    it("uses the default limit when no limit query param is provided", async () => {
        vi.mocked(getUserHistory).mockResolvedValue([]);

        const request = makeRequest({ method: "GET" });
        await GET(request, makeParams({ username: "username1" }));

        expect(getUserHistory).toHaveBeenCalledWith("username1", {
            type: undefined,
            limit: HISTORY_DEFAULT_LIMIT,
        });
    });

    it("falls back to the default limit when the limit query param is not a number", async () => {
        vi.mocked(getUserHistory).mockResolvedValue([]);

        const request = makeRequest({ method: "GET", searchParams: { limit: "not-a-number" } });
        await GET(request, makeParams({ username: "username1" }));

        expect(getUserHistory).toHaveBeenCalledWith("username1", {
            type: undefined,
            limit: HISTORY_DEFAULT_LIMIT,
        });
    });

    it("passes a recognized type filter through to the service", async () => {
        vi.mocked(getUserHistory).mockResolvedValue([]);

        const request = makeRequest({ method: "GET", searchParams: { type: "GAME" } });
        await GET(request, makeParams({ username: "username1" }));

        expect(getUserHistory).toHaveBeenCalledWith("username1", {
            type: "GAME",
            limit: HISTORY_DEFAULT_LIMIT,
        });
    });

    it("returns the history rows on success", async () => {
        const rows = [{ id: "history-1", user_id: "user-1", change: 100, reason: "DAILY", meta: null, created_at: "2026-01-01T00:00:00.000Z" }];
        vi.mocked(getUserHistory).mockResolvedValue(rows);

        const request = makeRequest({ method: "GET" });
        const response = await GET(request, makeParams({ username: "username1" }));

        await expectSuccessResponse(response, rows);
    });
});