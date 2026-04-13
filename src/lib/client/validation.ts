import { z } from "zod";
import { usernameRule, passwordRule, amountRule } from "@/lib/validation";
import * as CONFIG from "@/lib/config";

export const loginSchema = z.object({
    username: usernameRule,
    password: passwordRule,
});

export const registerSchema = z
    .object({
        username: usernameRule,
        password: passwordRule,
        confirmPassword: z.string(),
        tosAccepted: z.literal(true, { error: "You must accept the Terms of Service" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const transferSchema = z.object({
    username: usernameRule,
    amount: amountRule(CONFIG.TRANSFER_MIN, CONFIG.TRANSFER_MAX),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type TransferInput = z.infer<typeof transferSchema>;