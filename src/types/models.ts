export interface UserProfile {
    username: string;
    balance?: number;
    created_at?: string;
    rank: number;
}

export interface UserMe {
    username: string;
    balance: number;
    rank: number;
    daily: DailyStatus;
}

export interface DailyStatus {
    claimable: boolean;
    remaining: number | null;
}

export interface LeaderboardEntry {
    rank: number;
    username: string;
    balance: number;
}

export interface HistoryDetail {
    id: string;
    username: string;
    change: number;
    reason: string;
    meta?: Record<string, unknown> | null;
    created_at?: string;
}

export enum HistoryReason {
    DAILY = "DAILY",
    ADMIN = "ADMIN",
}

export namespace HistoryReason {
    export enum Game {
        CARDS = "GAME:CARDS",
        COINFLIP = "GAME:COINFLIP",
        COLORS = "GAME:COLORS",
        MINES = "GAME:MINES",
        SLOTS = "GAME:SLOTS",
        ROULETTE = "GAME:ROULETTE",
    }
    export enum Transfer {
        SENT = "TRANSFER:SENT",
        RECEIVED = "TRANSFER:RECEIVED",
    }
    export enum Steal {
        ROBBER = "STEAL:ROBBER",
        VICTIM = "STEAL:VICTIM",
    }
}