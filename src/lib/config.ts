export const USERNAME_MAX = 20;
export const PASSWORD_MAX = 100;
export const HASH_ROUNDS = 10;

export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
export const JWT_EXPIRES = "7d";

export const DAILY_AMOUNT = 100;

export const BET_MIN = 10;
export const GUARANTEED_LOSS_BET = 1_000_000;
export const WIN_RATE_PERCENT = 55;

export const TRANSFER_MIN = 0;
export const TRANSFER_MAX = 100_000_000;

export const STEAL_SUCCESS_PERCENT = 50;
export const STEAL_MIN = 0;
export const STEAL_MAX = 100_000_000;

export const LEADERBOARD_LIMIT = 20;

export const HISTORY_DEFAULT_LIMIT = 20;
export const HISTORY_MAX_LIMIT = 100;