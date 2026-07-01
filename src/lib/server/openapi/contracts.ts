import { z } from "zod";
import { Errors } from "@/lib/server/error";

export type ErrorCode = keyof typeof Errors;

export interface RouteContract {
    method: "get" | "post" | "put" | "delete";
    path: string;
    tag: string;
    summary: string;
    auth: boolean;
    body?: z.ZodTypeAny;
    response: z.ZodTypeAny;
    errors: ErrorCode[];
}

const userProfileSchema = z.object({
    username: z.string(),
    balance: z.number().int().nonnegative(),
    rank: z.number().int(),
    created_at: z.string().optional(),
});

const userMeSchema = z.object({
    username: z.string(),
    balance: z.number().int().nonnegative(),
    rank: z.number().int(),
    daily: z.object({
        claimable: z.boolean(),
        remaining: z.number().nullable(),
    }),
});

const historyRowSchema = z.object({
    id: z.string().optional(),
    user_id: z.string().optional(),
    change: z.number(),
    reason: z.string(),
    meta: z.record(z.string(), z.unknown()).nullable().optional(),
    created_at: z.string().optional(),
});

const historyDetailSchema = z.object({
    id: z.string(),
    username: z.string(),
    change: z.number(),
    reason: z.string(),
    meta: z.record(z.string(), z.unknown()).nullable().optional(),
    created_at: z.string().optional(),
});

const leaderboardEntrySchema = z.object({
    rank: z.number().int(),
    username: z.string(),
    balance: z.number(),
});

const gameResultSchema = z.object({
    won: z.boolean(),
    delta: z.number(),
    balance: z.number(),
});

const stealResultSchema = z.object({
    success: z.boolean(),
    delta: z.number(),
    balance: z.number(),
});

const transferResultSchema = z.object({
    transferred: z.number(),
    balance: z.number(),
});

const dailyClaimResultSchema = z.object({
    claimed: z.number(),
    balance: z.number(),
});

const dailyStatusSchema = z.object({
    claimable: z.boolean(),
    remaining: z.number().nullable(),
});

const loginResultSchema = z.object({
    token: z.string(),
    user: z.object({
        id: z.string(),
        username: z.string(),
        balance: z.number().optional(),
        created_at: z.string().optional(),
    }),
});

export const contracts: RouteContract[] = [
    {
        method: "post",
        path: "/api/auth/register",
        tag: "Auth",
        summary: "Register a new user",
        auth: false,
        body: z.object({ username: z.string(), password: z.string(), captchaToken: z.string() }),
        response: z.object({ success: z.literal(true) }),
        errors: ["INVALID_BODY", "INVALID_USERNAME", "USERNAME_TAKEN", "CAPTCHA_FAILED"],
    },
    {
        method: "post",
        path: "/api/auth/login",
        tag: "Auth",
        summary: "Log in with username and password",
        auth: false,
        body: z.object({ username: z.string(), password: z.string(), captchaToken: z.string() }),
        response: loginResultSchema,
        errors: ["INVALID_BODY", "INVALID_CREDENTIALS", "CAPTCHA_FAILED"],
    },
    {
        method: "get",
        path: "/api/daily",
        tag: "Daily",
        summary: "Get daily claim status",
        auth: true,
        response: dailyStatusSchema,
        errors: ["UNAUTHORIZED"],
    },
    {
        method: "post",
        path: "/api/daily",
        tag: "Daily",
        summary: "Claim the daily reward",
        auth: true,
        response: dailyClaimResultSchema,
        errors: ["UNAUTHORIZED", "COOLDOWN_ACTIVE"],
    },
    {
        method: "get",
        path: "/api/history/{id}",
        tag: "History",
        summary: "Get a single history entry by id",
        auth: false,
        response: historyDetailSchema,
        errors: ["HISTORY_NOT_FOUND"],
    },
    {
        method: "get",
        path: "/api/leaderboard",
        tag: "Leaderboard",
        summary: "Get the balance leaderboard",
        auth: false,
        response: z.array(leaderboardEntrySchema),
        errors: [],
    },
    {
        method: "post",
        path: "/api/play",
        tag: "Games",
        summary: "Play a game and bet an amount",
        auth: true,
        body: z.object({
            game: z.enum(["CARDS", "COINFLIP", "COLORS", "MINES", "SLOTS", "ROULETTE"]),
            bet: z.number(),
        }),
        response: gameResultSchema,
        errors: ["UNAUTHORIZED", "INVALID_BODY", "INSUFFICIENT_BALANCE"],
    },
    {
        method: "post",
        path: "/api/steal",
        tag: "Steal",
        summary: "Attempt to steal balance from another user",
        auth: true,
        body: z.object({ username: z.string(), amount: z.number() }),
        response: stealResultSchema,
        errors: ["UNAUTHORIZED", "STEAL_LIMIT", "SELF_STEAL", "INSUFFICIENT_BALANCE", "USER_NOT_FOUND"],
    },
    {
        method: "post",
        path: "/api/transfer",
        tag: "Transfer",
        summary: "Transfer balance to another user",
        auth: true,
        body: z.object({ username: z.string(), amount: z.number() }),
        response: transferResultSchema,
        errors: ["UNAUTHORIZED", "TRANSFER_LIMIT", "SELF_TRANSFER", "INSUFFICIENT_BALANCE", "USER_NOT_FOUND"],
    },
    {
        method: "get",
        path: "/api/users/me",
        tag: "Users",
        summary: "Get the current authenticated user",
        auth: true,
        response: userMeSchema,
        errors: ["UNAUTHORIZED"],
    },
    {
        method: "get",
        path: "/api/users/{username}/profile",
        tag: "Users",
        summary: "Get a user's public profile",
        auth: false,
        response: userProfileSchema,
        errors: ["USER_NOT_FOUND"],
    },
    {
        method: "get",
        path: "/api/users/{username}/history",
        tag: "Users",
        summary: "Get a user's history",
        auth: false,
        response: z.array(historyRowSchema),
        errors: ["USER_NOT_FOUND"],
    },
];