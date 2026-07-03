import { describe, vi, expect, it, beforeEach } from "vitest";
import { POST } from "@/app/(api)/api/steal/route";
import { stealBalance } from "@/lib/server/services/steal";
import { AppError, Errors } from "@/lib/server/error";
import { makeRequest } from "@/tests/helpers/requests";
import {
    expectUnauthorizedWithoutUserId,
    expectErrorResponse,
    expectInternalErrorResponse,
    expectSuccessResponse,
} from "@/tests/helpers/routeAssertions";

vi.mock("@/lib/server/services/steal");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("POST /api/steal", () => {
    const validBody = { fromUsername: "username2", amount: 100 };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns UNAUTHORIZED when the x-user-id header is missing", async () => {
        const request = makeRequest({ method: "POST", body: validBody });

        await expectUnauthorizedWithoutUserId(POST, request);

        expect(stealBalance).not.toHaveBeenCalled();
    });

    it("returns INVALID_BODY when the amount field is missing entirely", async () => {
        const request = makeRequest({
            method: "POST",
            userId: "user-1",
            body: { fromUsername: "username2" },
        });

        const response = await POST(request);

        await expectErrorResponse(response, Errors.INVALID_BODY);
        expect(stealBalance).not.toHaveBeenCalled();
    });

    it("converts a thrown AppError into an error response", async () => {
        vi.mocked(stealBalance).mockRejectedValue(new AppError(Errors.STEAL_LIMIT));

        const request = makeRequest({ method: "POST", userId: "user-1", body: validBody });
        const response = await POST(request);

        await expectErrorResponse(response, Errors.STEAL_LIMIT);
    });

    it("converts an unexpected error into an INTERNAL_ERROR response", async () => {
        vi.mocked(stealBalance).mockRejectedValue(new Error("connection lost"));

        const request = makeRequest({ method: "POST", userId: "user-1", body: validBody });
        const response = await POST(request);

        await expectInternalErrorResponse(response);
    });

    it("returns the steal result on success", async () => {
        vi.mocked(stealBalance).mockResolvedValue({ success: true, delta: 100, balance: 600 });

        const request = makeRequest({ method: "POST", userId: "user-1", body: validBody });
        const response = await POST(request);

        await expectSuccessResponse(response, { success: true, delta: 100, balance: 600 });
        expect(stealBalance).toHaveBeenCalledWith("user-1", "username2", 100);
    });
});