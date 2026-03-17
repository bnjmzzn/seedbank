export interface UserRow {
    id: string;
    username: string;
    password_hash: string;
    seeds: number;
    created_at: string | null;
}

export interface HistoryRow {
    id: string;
    user_id: string;
    change: number;
    action: string;
    created_at: string | null;
}