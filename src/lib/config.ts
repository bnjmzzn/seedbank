export const USERNAME_MAX = 20;
export const PASSWORD_MAX = 100;
export const HASH_ROUNDS = 10;

export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
export const JWT_EXPIRES = "7d";

export const DAILY_AMOUNT = 100;

export const BET_MIN = 10;
export const GUARANTEED_LOSS_BET = 1_000_000;
export const WIN_RATE_PERCENT = 55;