import { HistoryReason } from "@/types/models";
import { storage } from "./storage";
import { HistoryRow } from "@/types/db";
import { ActivityRadarPoint } from "@/components/shared/data/ActivityRadarChart";
import { BalanceTrendPoint } from "@/components/shared/data/BalanceTrendChart";
import { CURRENCY_TICKER } from "../config";

export function logout() {
    storage.clearAuth();
    window.location.href = "/login";
}

export function getAvatarUrl(username: string): string {
    return `https://api.dicebear.com/10.x/glyphs/svg?seed=${CURRENCY_TICKER}_${username}`;
}

export function filterHistory(rows: HistoryRow[], type?: string): HistoryRow[] {
    if (!type) return rows;
    return rows.filter((row) => row.reason === type || row.reason.startsWith(type + ":"));
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