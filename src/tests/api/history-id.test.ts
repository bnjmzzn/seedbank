import { describe, vi, expect, it, beforeEach } from "vitest";
import { GET } from "@/app/(api)/api/history/[id]/route";
import { getHistoryById } from "@/lib/server/services/history";
import { AppError, Errors } from "@/lib/server/error";
import { makeRequest, makeParams } from "@/tests/helpers/requests";
import { expectErrorResponse, expectInternalErrorResponse, expectSuccessResponse } from "@/tests/helpers/routeAssertions";

vi.mock("@/lib/server/services/history");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("GET /api/history/[id]", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("converts a thrown AppError into an error response", async () => {
        vi.mocked(getHistoryById).mockRejectedValue(new AppError(Errors.USER_NOT_FOUND));

        const request = makeRequest({ method: "GET" });
        const response = await GET(request, makeParams({ id: "history-1" }));

        await expectErrorResponse(response, Errors.USER_NOT_FOUND);
    });

    it("converts an unexpected error into an INTERNAL_ERROR response", async () => {
        vi.mocked(getHistoryById).mockRejectedValue(new Error("connection lost"));

        const request = makeRequest({ method: "GET" });
        const response = await GET(request, makeParams({ id: "history-1" }));

        await expectInternalErrorResponse(response);
    });

    it("returns the history detail on success", async () => {
        const detail = {
            id: "history-1",
            username: "username1",
            change: 100,
            reason: "DAILY",
            meta: null,
            created_at: "2026-01-01T00:00:00.000Z",
        };
        vi.mocked(getHistoryById).mockResolvedValue(detail);

        const request = makeRequest({ method: "GET" });
        const response = await GET(request, makeParams({ id: "history-1" }));

        await expectSuccessResponse(response, detail);
        expect(getHistoryById).toHaveBeenCalledWith("history-1");
    });
});