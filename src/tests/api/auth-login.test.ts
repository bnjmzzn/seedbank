import { describe, vi, expect, it, beforeEach } from "vitest";
import { POST } from "@/app/(api)/api/auth/login/route";
import { loginUser } from "@/lib/server/services/users";
import { verifyCaptcha } from "@/lib/server/captcha";
import { AppError, Errors } from "@/lib/server/error";
import { makeRequest } from "@/tests/helpers/requests";
import { expectErrorResponse, expectInternalErrorResponse, expectSuccessResponse } from "@/tests/helpers/routeAssertions";

vi.mock("@/lib/server/services/users");
vi.mock("@/lib/server/captcha");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("POST /api/auth/login", () => {
    const validBody = { username: "username1", password: "password1", captchaToken: "token" };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(verifyCaptcha).mockResolvedValue(undefined);
    });

    it("returns INVALID_BODY when the request body is empty", async () => {
        const request = makeRequest({ method: "POST", body: {} });
        const response = await POST(request);

        await expectErrorResponse(response, Errors.INVALID_BODY);
        expect(verifyCaptcha).not.toHaveBeenCalled();
        expect(loginUser).not.toHaveBeenCalled();
    });

    it("returns CAPTCHA_FAILED without calling the service when captcha verification fails", async () => {
        vi.mocked(verifyCaptcha).mockRejectedValue(new AppError(Errors.CAPTCHA_FAILED));

        const request = makeRequest({ method: "POST", body: validBody });
        const response = await POST(request);

        await expectErrorResponse(response, Errors.CAPTCHA_FAILED);
        expect(loginUser).not.toHaveBeenCalled();
    });

    it("converts a thrown AppError from the service into an error response", async () => {
        vi.mocked(loginUser).mockRejectedValue(new AppError(Errors.INVALID_CREDENTIALS));

        const request = makeRequest({ method: "POST", body: validBody });
        const response = await POST(request);

        await expectErrorResponse(response, Errors.INVALID_CREDENTIALS);
    });

    it("converts an unexpected error into an INTERNAL_ERROR response", async () => {
        vi.mocked(loginUser).mockRejectedValue(new Error("connection lost"));

        const request = makeRequest({ method: "POST", body: validBody });
        const response = await POST(request);

        await expectInternalErrorResponse(response);
    });

    it("returns the token and user on success", async () => {
        const result = { token: "signed-token", user: { id: "user-1", username: "username1", balance: 1000, created_at: "2026-01-01T00:00:00.000Z" } };
        vi.mocked(loginUser).mockResolvedValue(result);

        const request = makeRequest({ method: "POST", body: validBody });
        const response = await POST(request);

        await expectSuccessResponse(response, result);
        expect(loginUser).toHaveBeenCalledWith("username1", "password1");
    });
});