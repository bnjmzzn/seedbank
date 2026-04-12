export interface UserRow {
    id: string;
    username: string;
    password?: string;
    balance?: number;
    created_at?: string;
}

export interface HistoryRow {
    id?: string;
    user_id?: string;
    change: number;
    reason: string;
    meta?: Record<string, unknown> | null;
    created_at?: string;
}

export interface UserProfile extends Pick<UserRow, "username" | "balance" | "created_at"> {
    rank: number;
}

export interface UserMe {
    username: string;
    balance: number;
    rank: number;
    daily: {
        claimable: boolean;
        remaining: number | null;
    };
}

export interface LeaderboardEntry {
    rank: number;
    username: string;
    balance: number;
}

export enum HistoryReason {
    DAILY = "DAILY",
}

export namespace HistoryReason {
    export enum Game {
        COINFLIP = "GAME:COINFLIP",
        DICE = "GAME:DICE",
        COLOR = "GAME:COLOR",
        BOMB = "GAME:BOMB",
        RACE = "GAME:RACE",
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