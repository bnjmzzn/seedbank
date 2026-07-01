import { describe, vi, expect, it, beforeEach } from "vitest";
import { POST } from "@/app/(api)/api/auth/register/route";
import { registerUser } from "@/lib/server/services/users";
import { verifyCaptcha } from "@/lib/server/captcha";
import { AppError, Errors } from "@/lib/server/error";
import { makeRequest } from "@/tests/helpers/requests";
import { expectErrorResponse, expectInternalErrorResponse, expectSuccessResponse } from "@/tests/helpers/routeAssertions";

vi.mock("@/lib/server/services/users");
vi.mock("@/lib/server/captcha");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));

describe("POST /api/auth/register", () => {
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
        expect(registerUser).not.toHaveBeenCalled();
    });

    it("returns CAPTCHA_FAILED without calling the service when captcha verification fails", async () => {
        vi.mocked(verifyCaptcha).mockRejectedValue(new AppError(Errors.CAPTCHA_FAILED));

        const request = makeRequest({ method: "POST", body: validBody });
        const response = await POST(request);

        await expectErrorResponse(response, Errors.CAPTCHA_FAILED);
        expect(registerUser).not.toHaveBeenCalled();
    });

    it("converts a thrown AppError from the service into an error response", async () => {
        vi.mocked(registerUser).mockRejectedValue(new AppError(Errors.INVALID_USERNAME));

        const request = makeRequest({ method: "POST", body: validBody });
        const response = await POST(request);

        await expectErrorResponse(response, Errors.INVALID_USERNAME);
    });

    it("converts an unexpected error into an INTERNAL_ERROR response", async () => {
        vi.mocked(registerUser).mockRejectedValue(new Error("connection lost"));

        const request = makeRequest({ method: "POST", body: validBody });
        const response = await POST(request);

        await expectInternalErrorResponse(response);
    });

    it("returns success with no data on successful registration", async () => {
        vi.mocked(registerUser).mockResolvedValue(undefined);

        const request = makeRequest({ method: "POST", body: validBody });
        const response = await POST(request);

        await expectSuccessResponse(response, undefined);
        expect(registerUser).toHaveBeenCalledWith("username1", "password1");
    });
});