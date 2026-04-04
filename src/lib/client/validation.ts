import { z } from "zod";
import * as CONFIG from "@/lib/config";

const usernameRule = z
    .string()
    .min(CONFIG.USERNAME_MIN, `Min ${CONFIG.USERNAME_MIN} characters`)
    .max(CONFIG.USERNAME_MAX, `Max ${CONFIG.USERNAME_MAX} characters`)
    .regex(/^[a-zA-Z]/, "First character must be a letter")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed");

const passwordRule = z
    .string()
    .min(CONFIG.PASSWORD_MIN, `Min ${CONFIG.PASSWORD_MIN} characters`)
    .max(CONFIG.PASSWORD_MAX, `Max ${CONFIG.PASSWORD_MAX} characters`);

export const loginSchema = z.object({
    username: usernameRule,
    password: passwordRule,
});

export const registerSchema = z
    .object({
        username: usernameRule,
        password: passwordRule,
        confirmPassword: z.string(),
        tosAccepted: z.literal(true, "You must accept the Terms of Service"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;