import { describe, vi, expect, it, beforeEach } from "vitest";
import { GET } from "@/app/(api)/api/users/me/route";
import { getMe } from "@/lib/server/services/users";
import { AppError, Errors } from "@/lib/server/error";
import { makeRequest } from "@/tests/helpers/requests";
import {
    expectUnauthorizedWithoutUserId,
    expectErrorResponse,
    expectInternalErrorResponse,
    expectSuccessResponse,
} from "@/tests/helpers/routeAssertions";

vi.mock("@/lib/server/services/users");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("GET /api/users/me", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns UNAUTHORIZED when the x-user-id header is missing", async () => {
        const request = makeRequest({ method: "GET" });

        await expectUnauthorizedWithoutUserId(GET, request);

        expect(getMe).not.toHaveBeenCalled();
    });

    it("converts a thrown AppError into an error response", async () => {
        vi.mocked(getMe).mockRejectedValue(new AppError(Errors.UNAUTHORIZED));

        const request = makeRequest({ method: "GET", userId: "user-1" });
        const response = await GET(request);

        await expectErrorResponse(response, Errors.UNAUTHORIZED);
    });

    it("converts an unexpected error into an INTERNAL_ERROR response", async () => {
        vi.mocked(getMe).mockRejectedValue(new Error("connection lost"));

        const request = makeRequest({ method: "GET", userId: "user-1" });
        const response = await GET(request);

        await expectInternalErrorResponse(response);
    });

    it("returns the combined profile on success", async () => {
        const profile = {
            username: "username1",
            balance: 900,
            rank: 2,
            daily: { claimable: true, remaining: null },
        };
        vi.mocked(getMe).mockResolvedValue(profile);

        const request = makeRequest({ method: "GET", userId: "user-1" });
        const response = await GET(request);

        await expectSuccessResponse(response, profile);
        expect(getMe).toHaveBeenCalledWith("user-1");
    });
});