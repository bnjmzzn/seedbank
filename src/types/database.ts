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
    created_at?: string;
}

export interface UserProfile extends Pick<UserRow, "username" | "balance" | "created_at"> {
    rank: number;
}

export interface StealRow {
    id: string;
    stealer_id: string;
    target_id: string;
    amount: number;
    success: boolean;
    created_at?: string;
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
        SEND = "TRANSFER:SEND",
        RECEIVE = "TRANSFER:RECEIVE"
    }
    export enum Steal {
        CREDIT = "STEAL:CREDIT",
        DEBIT = "STEAL:DEBIT",
    }
}