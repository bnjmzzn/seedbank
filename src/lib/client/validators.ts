import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
    username: z.string().min(1, "Username is required").max(20, "Max 20 characters"),
    password: z.string().min(1, "Password is required").max(100, "Max 100 characters"),
});

export const transferSchema = z.object({
    username: z.string().min(1, "Username is required"),
    amount: z.coerce
        .number({ error : "Amount is required" })
        .int("Must be a whole number")
        .min(1, "Minimum 1 seed")
        .max(100_000_000, "Maximum 100,000,000 seeds"),
});

export const stealSchema = z.object({
    username: z.string().min(1, "Username is required"),
    amount: z.coerce
        .number({ error: "Amount is required" })
        .int("Must be a whole number")
        .min(1, "Minimum 1 seed")
        .max(100_000_000, "Maximum 100,000,000 seeds"),
});

export type StealSchema = z.infer<typeof stealSchema>;
export type TransferSchema = z.infer<typeof transferSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;