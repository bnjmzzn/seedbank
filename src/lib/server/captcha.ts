import { HCAPTCHA_SECRET } from "@/lib/server/config";
import { AppError, Errors } from "@/lib/server/error";

interface HcaptchaVerifyResponse {
    success: boolean;
}

export async function verifyCaptcha(token: string): Promise<void> {
    const hasToken = token.trim().length > 0;
    if (!hasToken) throw new AppError(Errors.CAPTCHA_FAILED);

    const body = new URLSearchParams({
        secret: HCAPTCHA_SECRET!,
        response: token,
    });

    const verifyResponse = await fetch("https://api.hcaptcha.com/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    const result: HcaptchaVerifyResponse = await verifyResponse.json();
    if (!result.success) throw new AppError(Errors.CAPTCHA_FAILED);
}