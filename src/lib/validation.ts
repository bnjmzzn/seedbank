import { z } from "zod";
import * as CONFIG from "@/lib/config";

export const usernameRule = z
    .string()
    .min(CONFIG.USERNAME_MIN, { error: `Min ${CONFIG.USERNAME_MIN} characters` })
    .max(CONFIG.USERNAME_MAX, { error: `Max ${CONFIG.USERNAME_MAX} characters` })
    .regex(/^[a-zA-Z]/, { error: "First character must be a letter" })
    .regex(CONFIG.USERNAME_REGEX, { error: "Only letters, numbers, and underscores allowed" });

export const passwordRule = z
    .string()
    .min(CONFIG.PASSWORD_MIN, { error: `Min ${CONFIG.PASSWORD_MIN} characters` })
    .max(CONFIG.PASSWORD_MAX, { error: `Max ${CONFIG.PASSWORD_MAX} characters` });

export const amountRule = (min: number, max: number) =>
    z
        .number()
        .int({ error: "Must be a whole number" })
        .min(min, { error: `Minimum is ${min.toLocaleString()} SEED` })
        .max(max, { error: `Maximum is ${max.toLocaleString()} SEED` });