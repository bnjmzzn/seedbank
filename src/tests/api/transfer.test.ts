import { describe, vi, expect, it, beforeEach } from "vitest";
import { POST } from "@/app/(api)/api/transfer/route";
import { transferBalance } from "@/lib/server/services/transfer";
import { AppError, Errors } from "@/lib/server/error";
import { makeRequest } from "@/tests/helpers/requests";
import {
    expectUnauthorizedWithoutUserId,
    expectErrorResponse,
    expectInternalErrorResponse,
    expectSuccessResponse,
} from "@/tests/helpers/routeAssertions";

vi.mock("@/lib/server/services/transfer");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("POST /api/transfer", () => {
    const validBody = { toUsername: "username2", amount: 100 };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns UNAUTHORIZED when the x-user-id header is missing", async () => {
        const request = makeRequest({ method: "POST", body: validBody });

        await expectUnauthorizedWithoutUserId(POST, request);

        expect(transferBalance).not.toHaveBeenCalled();
    });

    it("returns INVALID_BODY when the request body is empty", async () => {
        const request = makeRequest({ method: "POST", userId: "user-1", body: {} });

        const response = await POST(request);

        await expectErrorResponse(response, Errors.INVALID_BODY);
        expect(transferBalance).not.toHaveBeenCalled();
    });

    it("converts a thrown AppError into an error response", async () => {
        vi.mocked(transferBalance).mockRejectedValue(new AppError(Errors.TRANSFER_LIMIT));

        const request = makeRequest({ method: "POST", userId: "user-1", body: validBody });
        const response = await POST(request);

        await expectErrorResponse(response, Errors.TRANSFER_LIMIT);
    });

    it("converts an unexpected error into an INTERNAL_ERROR response", async () => {
        vi.mocked(transferBalance).mockRejectedValue(new Error("connection lost"));

        const request = makeRequest({ method: "POST", userId: "user-1", body: validBody });
        const response = await POST(request);

        await expectInternalErrorResponse(response);
    });

    it("returns the transfer result on success", async () => {
        vi.mocked(transferBalance).mockResolvedValue({ transferred: 100, balance: 400 });

        const request = makeRequest({ method: "POST", userId: "user-1", body: validBody });
        const response = await POST(request);

        await expectSuccessResponse(response, { transferred: 100, balance: 400 });
        expect(transferBalance).toHaveBeenCalledWith("user-1", "username2", 100);
    });
});