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
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const transferSchema = z.object({
    username: usernameRule,
    amount: amountRule(CONFIG.TRANSFER_MIN, CONFIG.TRANSFER_MAX),
});

export const stealSchema = z.object({
    username: usernameRule,
    amount: amountRule(CONFIG.STEAL_MIN, CONFIG.STEAL_MAX),
});

export const playSchema = z.object({
    amount: amountRule(CONFIG.BET_MIN, CONFIG.BET_MAX),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;