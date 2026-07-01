import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyCaptcha } from "@/lib/server/captcha";
import { AppError, Errors } from "@/lib/server/error";

describe("verifyCaptcha", () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("throws CAPTCHA_FAILED when the token is missing", async () => {
        await expect(verifyCaptcha("")).rejects.toThrow(
            new AppError(Errors.CAPTCHA_FAILED).code,
        );

        expect(fetch).not.toHaveBeenCalled();
    });

    it("throws CAPTCHA_FAILED when the token is only whitespace", async () => {
        await expect(verifyCaptcha("   ")).rejects.toThrow(
            new AppError(Errors.CAPTCHA_FAILED).code,
        );

        expect(fetch).not.toHaveBeenCalled();
    });

    it("throws CAPTCHA_FAILED when the external verification call reports failure", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => ({ success: false }),
        } as Response);

        await expect(verifyCaptcha("some-token")).rejects.toThrow(
            new AppError(Errors.CAPTCHA_FAILED).code,
        );
    });

    it("resolves successfully when the external verification call reports success", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => ({ success: true }),
        } as Response);

        await expect(verifyCaptcha("some-token")).resolves.toBeUndefined();
    });
});