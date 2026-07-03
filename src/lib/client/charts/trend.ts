import { HistoryRow } from "@/types/db";
import { TrendPoint } from "@/components/shared/data/TrendChart";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function buildBalanceHistoryData(rows: HistoryRow[], startingBalance = 0): TrendPoint[] {
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

function startOfDay(timestamp: number): number {
    const date = new Date(timestamp);

    date.setHours(0, 0, 0, 0);

    return date.getTime();
}

const MAX_TREND_DAYS = 365;

export function buildActivityTrendData(rows: HistoryRow[]): TrendPoint[] {
    const dailyCounts = new Map<number, number>();

    for (const row of rows) {
        if (!row.created_at) {
            continue;
        }

        const day = startOfDay(new Date(row.created_at).getTime());

        dailyCounts.set(day, (dailyCounts.get(day) ?? 0) + 1);
    }

    if (dailyCounts.size === 0) {
        return [];
    }

    const days = Array.from(dailyCounts.keys()).sort((a, b) => a - b);
    const lastDay = days[days.length - 1];
    const earliestAllowedDay = lastDay - (MAX_TREND_DAYS - 1) * DAY_IN_MS;
    const firstDay = Math.max(days[0], earliestAllowedDay);

    const points: TrendPoint[] = [];
    let index = 0;

    for (let day = firstDay; day <= lastDay; day += DAY_IN_MS) {
        points.push({
            index,
            value: dailyCounts.get(day) ?? 0,
            timestamp: day,
        });

        index += 1;
    }

    return points;
}