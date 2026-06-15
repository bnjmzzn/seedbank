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

export enum HistoryReason {
    DAILY = "DAILY",
}

export namespace HistoryReason {
    export enum Game {
        CARDS = "GAME:CARDS",
        COINFLIP = "GAME:COINFLIP",
        COLOR_CUBE = "GAME:COLOR_CUBE",
        MINESWEEPER = "GAME:MINESWEEPER",
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