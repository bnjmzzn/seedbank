import type { UserRow } from "@/types/db";

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    code?: string;
}

export interface GameResult {
    won: boolean;
    delta: number;
    balance: number;
}

export interface StealResult {
    success: boolean;
    delta: number;
    balance: number;
}

export interface TransferResult {
    transferred: number;
    balance: number;
}

export interface DailyClaimResult {
    claimed: number;
    balance: number;
}

export interface LoginResult {
    token: string;
    user: Omit<UserRow, "password">;
}