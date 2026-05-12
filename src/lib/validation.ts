import { z } from "zod";
import * as CONFIG from "@/lib/config";

export const usernameRule = z
    .string()
    .min(CONFIG.USERNAME_MIN, { message: `Min ${CONFIG.USERNAME_MIN} characters` })
    .max(CONFIG.USERNAME_MAX, { message: `Max ${CONFIG.USERNAME_MAX} characters` })
    .regex(/^[a-zA-Z]/, { message: "First character must be a letter" })
    .regex(CONFIG.USERNAME_REGEX, { message: "Only letters, numbers, and underscores allowed" });

export const passwordRule = z
    .string()
    .min(CONFIG.PASSWORD_MIN, { message: `Min ${CONFIG.PASSWORD_MIN} characters` })
    .max(CONFIG.PASSWORD_MAX, { message: `Max ${CONFIG.PASSWORD_MAX} characters` });

export const amountRule = (min: number, max: number) =>
    z
        .number()
        .int({ message: "Must be a whole number" })
        .min(min, { message: `Minimum is ${min.toLocaleString()} ${CONFIG.CURRENCY_TICKER}` })
        .max(max, { message: `Maximum is ${max.toLocaleString()} ${CONFIG.CURRENCY_TICKER}` });