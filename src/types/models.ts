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