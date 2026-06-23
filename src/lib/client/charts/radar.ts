import { HistoryReason } from "@/types/models";
import { HistoryRow } from "@/types/db";
import { RadarPoint } from "@/components/shared/data/RadarChart";

function buildRadarCounts(rows: HistoryRow[], limit?: number): RadarPoint[] {
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

function filterGameRows(rows: HistoryRow[]): HistoryRow[] {
    return rows.filter((row) =>
        Object.values(HistoryReason.Game).includes(row.reason as HistoryReason.Game)
    );
}

function stripGamePrefix(reason: string): string {
    return reason.includes(":") ? reason.split(":")[1] : reason;
}

function buildGamesOutcomeRadarData(rows: HistoryRow[], wins: boolean): RadarPoint[] {
    const gameRows = filterGameRows(rows);
    const reasons = new Set(gameRows.map((row) => row.reason));

    const outcomeCounts = new Map<string, number>();

    for (const row of gameRows) {
        const isWin = row.change > 0;

        if (isWin !== wins) {
            continue;
        }

        outcomeCounts.set(row.reason, (outcomeCounts.get(row.reason) ?? 0) + 1);
    }

    const points = Array.from(reasons).map((reason) => ({
        axis: stripGamePrefix(reason),
        value: outcomeCounts.get(reason) ?? 0,
    }));

    return points.sort((a, b) => a.axis.localeCompare(b.axis));
}

export function buildActionsRadarData(rows: HistoryRow[], limit?: number): RadarPoint[] {
    return buildRadarCounts(rows, limit);
}

export function buildGamesWonRadarData(rows: HistoryRow[]): RadarPoint[] {
    return buildGamesOutcomeRadarData(rows, true);
}

export function buildGamesLostRadarData(rows: HistoryRow[]): RadarPoint[] {
    return buildGamesOutcomeRadarData(rows, false);
}