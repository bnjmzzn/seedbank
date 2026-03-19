export const USERNAME_MAX = 20;
export const PASSWORD_MAX = 100;
export const HASH_ROUNDS = 10;

export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
export const JWT_EXPIRES = "7d";