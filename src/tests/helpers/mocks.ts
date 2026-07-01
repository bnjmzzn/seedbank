import type { UserRow, HistoryRow } from "@/types/db";

export function mockUser(index = 1, overrides: Partial<UserRow> = {}): UserRow {
    return {
        id: `user-${index}`,
        username: `username${index}`,
        password: `password${index}`,
        balance: 1000,
        created_at: "2026-01-01T00:00:00.000Z",
        ...overrides,
    };
}

export function mockHistoryRow(index = 1, overrides: Partial<HistoryRow> = {}): HistoryRow {
    return {
        id: `history-${index}`,
        user_id: "user-1",
        change: 100,
        reason: "DAILY",
        meta: null,
        created_at: "2026-01-01T00:00:00.000Z",
        ...overrides,
    };
}