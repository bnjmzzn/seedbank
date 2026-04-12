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