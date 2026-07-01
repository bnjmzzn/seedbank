import { describe, vi, expect, it, beforeEach } from "vitest";
import { GET } from "@/app/(api)/api/users/[username]/profile/route";
import { getUserProfile } from "@/lib/server/services/users";
import { AppError, Errors } from "@/lib/server/error";
import { makeRequest, makeParams } from "@/tests/helpers/requests";
import { expectErrorResponse, expectInternalErrorResponse, expectSuccessResponse } from "@/tests/helpers/routeAssertions";

vi.mock("@/lib/server/services/users");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("GET /api/users/[username]/profile", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("converts a thrown AppError into an error response", async () => {
        vi.mocked(getUserProfile).mockRejectedValue(new AppError(Errors.USER_NOT_FOUND));

        const request = makeRequest({ method: "GET" });
        const response = await GET(request, makeParams({ username: "username1" }));

        await expectErrorResponse(response, Errors.USER_NOT_FOUND);
    });

    it("converts an unexpected error into an INTERNAL_ERROR response", async () => {
        vi.mocked(getUserProfile).mockRejectedValue(new Error("connection lost"));

        const request = makeRequest({ method: "GET" });
        const response = await GET(request, makeParams({ username: "username1" }));

        await expectInternalErrorResponse(response);
    });

    it("returns the user profile on success", async () => {
        const profile = { username: "username1", balance: 750, rank: 3, created_at: "2026-01-01T00:00:00.000Z" };
        vi.mocked(getUserProfile).mockResolvedValue(profile);

        const request = makeRequest({ method: "GET" });
        const response = await GET(request, makeParams({ username: "username1" }));

        await expectSuccessResponse(response, profile);
        expect(getUserProfile).toHaveBeenCalledWith("username1");
    });
});