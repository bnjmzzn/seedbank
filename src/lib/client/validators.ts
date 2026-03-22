import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
    username: z.string().min(1, "Username is required").max(20, "Max 20 characters"),
    password: z.string().min(1, "Password is required").max(100, "Max 100 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;