import { describe, vi, expect, it, beforeEach } from "vitest";
import { POST } from "@/app/(api)/api/play/route";
import { playGame } from "@/lib/server/services/game";
import { AppError, Errors } from "@/lib/server/error";
import { makeRequest } from "@/tests/helpers/requests";
import {
    expectUnauthorizedWithoutUserId,
    expectErrorResponse,
    expectInternalErrorResponse,
    expectSuccessResponse,
} from "@/tests/helpers/routeAssertions";
import { HistoryReason } from "@/types/models";

vi.mock("@/lib/server/services/game");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("POST /api/play", () => {
    const validBody = { game: HistoryReason.Game.COINFLIP, bet: 100 };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns UNAUTHORIZED when the x-user-id header is missing", async () => {
        const request = makeRequest({ method: "POST", body: validBody });

        await expectUnauthorizedWithoutUserId(POST, request);

        expect(playGame).not.toHaveBeenCalled();
    });

    it("returns INVALID_BODY when the request body is empty", async () => {
        const request = makeRequest({ method: "POST", userId: "user-1", body: {} });

        const response = await POST(request);

        await expectErrorResponse(response, Errors.INVALID_BODY);
        expect(playGame).not.toHaveBeenCalled();
    });

    it("converts a thrown AppError into an error response", async () => {
        vi.mocked(playGame).mockRejectedValue(new AppError(Errors.INSUFFICIENT_BALANCE));

        const request = makeRequest({ method: "POST", userId: "user-1", body: validBody });
        const response = await POST(request);

        await expectErrorResponse(response, Errors.INSUFFICIENT_BALANCE);
    });

    it("converts an unexpected error into an INTERNAL_ERROR response", async () => {
        vi.mocked(playGame).mockRejectedValue(new Error("connection lost"));

        const request = makeRequest({ method: "POST", userId: "user-1", body: validBody });
        const response = await POST(request);

        await expectInternalErrorResponse(response);
    });

    it("returns the game result on success", async () => {
        vi.mocked(playGame).mockResolvedValue({ won: true, delta: 100, balance: 1100 });

        const request = makeRequest({ method: "POST", userId: "user-1", body: validBody });
        const response = await POST(request);

        await expectSuccessResponse(response, { won: true, delta: 100, balance: 1100 });
        expect(playGame).toHaveBeenCalledWith("user-1", HistoryReason.Game.COINFLIP, 100);
    });
});