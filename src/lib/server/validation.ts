import { z } from "zod";
import { usernameRule, passwordRule, amountRule } from "@/lib/validation";
import { Errors, AppError } from "@/lib/server/error";
import { HistoryReason } from "@/types/models";
import * as CONFIG from "@/lib/config";

export const loginBodySchema = z.object({
    username: usernameRule,
    password: passwordRule,
});

export const registerBodySchema = z.object({
    username: usernameRule,
    password: passwordRule,
});

export const transferBodySchema = z.object({
    toUsername: usernameRule,
    amount: amountRule(CONFIG.TRANSFER_MIN, CONFIG.TRANSFER_MAX),
});

export const stealBodySchema = z.object({
    fromUsername: usernameRule,
    amount: amountRule(CONFIG.STEAL_MIN, CONFIG.STEAL_MAX),
});

export const playBodySchema = z.object({
    game: z.enum(Object.values(HistoryReason.Game) as [string, ...string[]]),
    bet: amountRule(CONFIG.BET_MIN, CONFIG.BET_MAX),
});

export function parseBody<T>(schema: z.ZodType<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);
        const message: Record<string, string | undefined> = {};
        for (const [k, v] of Object.entries(fieldErrors)) {
            message[k] = Array.isArray(v) ? v[0] : undefined;
        }
        throw new AppError(Errors.INVALID_BODY, message);
    }
    return result.data;
}