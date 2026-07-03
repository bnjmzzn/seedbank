"use client";

import { Box, Skeleton, Typography } from "@mui/material";
import { HistoryReason } from "@/types/models";
import { HistoryRow } from "@/types/db";

interface StatLineProps {
    label: string;
    value: string;
    count?: number;
}

function StatLine({ label, value, count }: StatLineProps) {
    return (
        <Box sx={{ display: "flex", gap: 1, minWidth: 0 }}>
            <Typography noWrap color="text.secondary">{label}:</Typography>
            <Typography noWrap fontFamily="monospace" fontWeight="bold">
                {value}
                {count !== undefined && (
                    <Typography component="span" color="text.secondary" fontFamily="monospace" fontWeight="normal">
                        {" "}({count.toLocaleString()}x)
                    </Typography>
                )}
            </Typography>
        </Box>
    );
}

interface StatBlockProps {
    title: string;
    children: React.ReactNode;
}

function StatBlock({ title, children }: StatBlockProps) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="text.primary" lineHeight={1.4}>
                {title}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                {children}
            </Box>
        </Box>
    );
}

function formatSigned(value: number): string {
    if (value > 0) {
        return `+${value.toLocaleString()}`;
    }

    if (value < 0) {
        return `-${Math.abs(value).toLocaleString()}`;
    }

    return value.toLocaleString();
}

function formatRatio(profit: number, lost: number): string {
    if (lost === 0) {
        return profit === 0 ? "0.00x" : "∞";
    }

    return `${(profit / lost).toFixed(2)}x`;
}

interface GameAggregate {
    wins: number;
    profit: number;
    losses: number;
    lost: number;
    sessions: number;
}

function createEmptyAggregate(): GameAggregate {
    return {
        wins: 0,
        profit: 0,
        losses: 0,
        lost: 0,
        sessions: 0,
    };
}

interface AggregatedStats {
    sessionCount: number;
    sessionMean: number;
    games: Map<string, GameAggregate>;
    transferSent: { total: number; count: number };
    transferReceived: { total: number; count: number };
    stealStolen: { total: number; count: number };
    stealStolenFrom: { total: number; count: number };
    dailyTotal: { total: number; count: number };
}

const GAME_LABELS: Record<string, string> = {
    [HistoryReason.Game.CARDS]: "Cards",
    [HistoryReason.Game.COINFLIP]: "Coinflip",
    [HistoryReason.Game.COLORS]: "Colors",
    [HistoryReason.Game.MINES]: "Mines",
    [HistoryReason.Game.ROULETTE]: "Roulette",
    [HistoryReason.Game.SLOTS]: "Slots",
};

function isGameReason(reason: string): boolean {
    return reason.startsWith("GAME:");
}

function aggregateStats(rows: HistoryRow[]): AggregatedStats {
    const games = new Map<string, GameAggregate>();
    let transferSentTotal = 0;
    let transferSentCount = 0;
    let transferReceivedTotal = 0;
    let transferReceivedCount = 0;
    let stealStolenTotal = 0;
    let stealStolenCount = 0;
    let stealStolenFromTotal = 0;
    let stealStolenFromCount = 0;
    let dailyTotal = 0;
    let dailyCount = 0;
    let sessionTotal = 0;

    for (const row of rows) {
        sessionTotal += row.change;

        if (isGameReason(row.reason)) {
            const aggregate = games.get(row.reason) ?? createEmptyAggregate();

            aggregate.sessions += 1;

            if (row.change > 0) {
                aggregate.wins += 1;
                aggregate.profit += row.change;
            } else if (row.change < 0) {
                aggregate.losses += 1;
                aggregate.lost += Math.abs(row.change);
            }

            games.set(row.reason, aggregate);
            continue;
        }

        if (row.reason === HistoryReason.Transfer.SENT) {
            transferSentTotal += Math.abs(row.change);
            transferSentCount += 1;
            continue;
        }

        if (row.reason === HistoryReason.Transfer.RECEIVED) {
            transferReceivedTotal += row.change;
            transferReceivedCount += 1;
            continue;
        }

        if (row.reason === HistoryReason.Steal.ROBBER) {
            stealStolenTotal += row.change;
            stealStolenCount += 1;
            continue;
        }

        if (row.reason === HistoryReason.Steal.VICTIM) {
            stealStolenFromTotal += Math.abs(row.change);
            stealStolenFromCount += 1;
            continue;
        }

        if (row.reason === HistoryReason.DAILY) {
            dailyTotal += row.change;
            dailyCount += 1;
            continue;
        }
    }

    const sessionCount = rows.length;
    const sessionMean = sessionCount === 0 ? 0 : sessionTotal / sessionCount;

    return {
        sessionCount,
        sessionMean,
        games,
        transferSent: { total: transferSentTotal, count: transferSentCount },
        transferReceived: { total: transferReceivedTotal, count: transferReceivedCount },
        stealStolen: { total: stealStolenTotal, count: stealStolenCount },
        stealStolenFrom: { total: stealStolenFromTotal, count: stealStolenFromCount },
        dailyTotal: { total: dailyTotal, count: dailyCount },
    };
}

function sortedGameEntries(games: Map<string, GameAggregate>): Array<[string, GameAggregate]> {
    const entries = Array.from(games.entries());

    entries.sort((a, b) => {
        const labelA = GAME_LABELS[a[0]] ?? a[0];
        const labelB = GAME_LABELS[b[0]] ?? b[0];

        return labelA.localeCompare(labelB);
    });

    return entries;
}

function StatsBreakdownSkeleton() {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
            }}
        >
            {Array.from({ length: 3 }).map((_, blockIndex) => (
                <Box key={blockIndex} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Skeleton variant="text" width={120} height={28} />
                    {Array.from({ length: 4 }).map((_, lineIndex) => (
                        <Box key={lineIndex} sx={{ display: "flex", gap: 1 }}>
                            <Skeleton variant="text" width={90} />
                            <Skeleton variant="text" width={50} />
                        </Box>
                    ))}
                </Box>
            ))}
        </Box>
    );
}

interface StatsBreakdownProps {
    rows: HistoryRow[];
    isLoading?: boolean;
}

export default function StatsBreakdown({ rows, isLoading }: StatsBreakdownProps) {
    if (isLoading) {
        return <StatsBreakdownSkeleton />;
    }

    if (rows.length === 0) {
        return (
            <Box sx={{ minHeight: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography color="text.secondary">No history yet.</Typography>
            </Box>
        );
    }

    const stats = aggregateStats(rows);
    const gameEntries = sortedGameEntries(stats.games);

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
            }}
        >
            <StatBlock title="Overview">
                <StatLine label="Total sessions" value={stats.sessionCount.toLocaleString()} />
                <StatLine label="Mean per session" value={formatSigned(Math.round(stats.sessionMean))} />
            </StatBlock>

            {gameEntries.map(([reason, aggregate]) => {
                const label = GAME_LABELS[reason] ?? reason;

                return (
                    <StatBlock key={reason} title={label}>
                        <StatLine label="Total wins" value={aggregate.wins.toLocaleString()} />
                        <StatLine label="Total losses" value={aggregate.losses.toLocaleString()} />
                        <StatLine label="Total profit" value={`+${aggregate.profit.toLocaleString()}`} count={aggregate.sessions} />
                        <StatLine label="Total lost" value={`-${aggregate.lost.toLocaleString()}`} count={aggregate.sessions} />
                        <StatLine label="Net ratio" value={formatRatio(aggregate.profit, aggregate.lost)} />
                    </StatBlock>
                );
            })}

            <StatBlock title="Transfer">
                <StatLine
                    label="Total received"
                    value={`+${stats.transferReceived.total.toLocaleString()}`}
                    count={stats.transferReceived.count}
                />
                <StatLine
                    label="Total sent"
                    value={`-${stats.transferSent.total.toLocaleString()}`}
                    count={stats.transferSent.count}
                />
            </StatBlock>

            <StatBlock title="Steal">
                <StatLine
                    label="Total stolen"
                    value={`+${stats.stealStolen.total.toLocaleString()}`}
                    count={stats.stealStolen.count}
                />
                <StatLine
                    label="Total stolen from you"
                    value={`-${stats.stealStolenFrom.total.toLocaleString()}`}
                    count={stats.stealStolenFrom.count}
                />
            </StatBlock>

            <StatBlock title="Daily">
                <StatLine
                    label="Total claimed"
                    value={`+${stats.dailyTotal.total.toLocaleString()}`}
                    count={stats.dailyTotal.count}
                />
            </StatBlock>
        </Box>
    );
}