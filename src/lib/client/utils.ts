import { HistoryReason } from "@/types/models";
import { storage } from "./storage";
import { HistoryRow } from "@/types/db";
import { ActivityRadarPoint } from "@/components/shared/data/ActivityRadarChart";
import { BalanceTrendPoint } from "@/components/shared/data/BalanceTrendChart";

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

export interface BalancePoint {
    change: number;
    balanceBefore: number;
    balanceAfter: number;
    date: string;
    reason: string;
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

function buildRadarCounts(rows: HistoryRow[], limit?: number): ActivityRadarPoint[] {
    const counts = new Map<string, number>();

    for (const row of rows) {
        counts.set(row.reason, (counts.get(row.reason) ?? 0) + 1);
    }

    const sorted = Array.from(counts.entries())
        .map(([axis, value]) => ({ axis, value }))
        .sort((a, b) => b.value - a.value);

    if (limit === undefined) {
        return sorted;
    }

    return sorted.slice(0, limit);
}

export function buildActionsRadarData(rows: HistoryRow[], limit?: number): ActivityRadarPoint[] {
    return buildRadarCounts(rows, limit);
}

export function buildGamesRadarData(rows: HistoryRow[], limit?: number): ActivityRadarPoint[] {
    const gameRows = rows.filter((row) =>
        Object.values(HistoryReason.Game).includes(row.reason as HistoryReason.Game)
    );

    return buildRadarCounts(gameRows, limit);
}

export function buildBalanceHistoryData(rows: HistoryRow[], startingBalance = 0): BalanceTrendPoint[] {
    const sorted = [...rows].sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;

        return timeA - timeB;
    });

    let runningBalance = startingBalance;

    const points = sorted.map((row, index) => {
        runningBalance += row.change;

        return {
            index,
            value: runningBalance,
            timestamp: row.created_at ? new Date(row.created_at).getTime() : 0,
        };
    });

    return points;
}