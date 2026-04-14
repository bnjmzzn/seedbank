import { storage } from "./storage";
import { HistoryRow } from "@/types/db";

export interface BalancePoint {
    change: number;
    balanceBefore: number;
    balanceAfter: number;
    date: string;
    reason: string;
}

export function logout() {
    storage.clearAuth();
    window.location.href = "/login";
}

export function getAvatarUrl(username: string | null): string {
    return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=seedbank_${username}`;
}

export function filterHistory(rows: HistoryRow[], type?: string): HistoryRow[] {
    if (!type) return rows;
    return rows.filter((row) => row.reason === type || row.reason.startsWith(type + ":"));
}

export function buildBalanceTimeline(rows: HistoryRow[], currentBalance: number): BalancePoint[] {
    const sorted = [...rows].sort(
        (a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
    );

    let running = currentBalance;
    const reversed = [...sorted].reverse().map((row) => {
        const balanceAfter = running;
        const balanceBefore = running - row.change;
        running = balanceBefore;
        return { row, balanceBefore, balanceAfter };
    });

    return reversed.reverse().map(({ row, balanceBefore, balanceAfter }) => ({
        change: row.change,
        balanceBefore,
        balanceAfter,
        date: row.created_at ?? "",
        reason: row.reason,
    }));
}