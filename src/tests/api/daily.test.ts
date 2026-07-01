import { describe, vi, expect, it, beforeEach } from "vitest";
import { GET, POST } from "@/app/(api)/api/daily/route";
import { claimDaily, getDailyStatus } from "@/lib/server/services/daily";
import { AppError, Errors } from "@/lib/server/error";
import { makeRequest } from "@/tests/helpers/requests";
import {
    expectUnauthorizedWithoutUserId,
    expectErrorResponse,
    expectInternalErrorResponse,
    expectSuccessResponse,
} from "@/tests/helpers/routeAssertions";

vi.mock("@/lib/server/services/daily");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("GET /api/daily", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns UNAUTHORIZED when the x-user-id header is missing", async () => {
        const request = makeRequest({ method: "GET" });

        await expectUnauthorizedWithoutUserId(GET, request);

        expect(getDailyStatus).not.toHaveBeenCalled();
    });

    it("converts an unexpected error into an INTERNAL_ERROR response", async () => {
        vi.mocked(getDailyStatus).mockRejectedValue(new Error("connection lost"));

        const request = makeRequest({ method: "GET", userId: "user-1" });
        const response = await GET(request);

        await expectInternalErrorResponse(response);
    });

    it("returns the daily status on success", async () => {
        vi.mocked(getDailyStatus).mockResolvedValue({ claimable: true, remaining: null });

        const request = makeRequest({ method: "GET", userId: "user-1" });
        const response = await GET(request);

        await expectSuccessResponse(response, { claimable: true, remaining: null });
        expect(getDailyStatus).toHaveBeenCalledWith("user-1");
    });
});

describe("POST /api/daily", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns UNAUTHORIZED when the x-user-id header is missing", async () => {
        const request = makeRequest({ method: "POST" });

        await expectUnauthorizedWithoutUserId(POST, request);

        expect(claimDaily).not.toHaveBeenCalled();
    });

    it("converts a thrown AppError into an error response", async () => {
        vi.mocked(claimDaily).mockRejectedValue(new AppError(Errors.COOLDOWN_ACTIVE));

        const request = makeRequest({ method: "POST", userId: "user-1" });
        const response = await POST(request);

        await expectErrorResponse(response, Errors.COOLDOWN_ACTIVE);
    });

    it("converts an unexpected error into an INTERNAL_ERROR response", async () => {
        vi.mocked(claimDaily).mockRejectedValue(new Error("connection lost"));

        const request = makeRequest({ method: "POST", userId: "user-1" });
        const response = await POST(request);

        await expectInternalErrorResponse(response);
    });

    it("returns the claim result on success", async () => {
        vi.mocked(claimDaily).mockResolvedValue({ claimed: 100, balance: 1100 });

        const request = makeRequest({ method: "POST", userId: "user-1" });
        const response = await POST(request);

        await expectSuccessResponse(response, { claimed: 100, balance: 1100 });
        expect(claimDaily).toHaveBeenCalledWith("user-1");
    });
});