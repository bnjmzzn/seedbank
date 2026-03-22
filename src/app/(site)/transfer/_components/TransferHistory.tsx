"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Bean, ArrowUpRight, ArrowDownLeft, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchHistory } from "@/lib/client/api";
import { useUser } from "@/context/UserContext";
import type { HistoryRow } from "@/types/database";

const REASON_LABELS: Record<string, { label: string; icon: React.ReactNode; positive: boolean | null }> = {
    "TRANSFER:SEND":    { label: "Transfer sent",     icon: <ArrowUpRight size={14} />,  positive: false },
    "TRANSFER:RECEIVE": { label: "Transfer received", icon: <ArrowDownLeft size={14} />, positive: true  },
    "STEAL:CREDIT":     { label: "Steal success",     icon: <ArrowDownLeft size={14} />, positive: true  },
    "STEAL:DEBIT":      { label: "Steal failed",      icon: <ArrowUpRight size={14} />,  positive: false },
    "DAILY":            { label: "Daily claim",       icon: <Bean size={14} />,          positive: true  },
    "GAME:COINFLIP":    { label: "Coinflip",          icon: null,                        positive: null  },
    "GAME:DICE":        { label: "Dice",              icon: null,                        positive: null  },
    "GAME:COLOR":       { label: "Color pick",        icon: null,                        positive: null  },
    "GAME:BOMB":        { label: "Bomb",              icon: null,                        positive: null  },
    "GAME:RACE":        { label: "Race",              icon: null,                        positive: null  },
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const PAGE_SIZE = 20;

interface Props {
    refreshKey: number;
}

export default function TransferHistory({ refreshKey }: Props) {
    const { username } = useUser();
    const [history, setHistory] = useState<HistoryRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const load = useCallback(async (nextOffset: number, replace = false) => {
        setLoading(true);
        try {
            const res = await fetchHistory(username, PAGE_SIZE + 1, nextOffset);
            const entries: HistoryRow[] = res.data;
            const hasNext = entries.length > PAGE_SIZE;
            const page = hasNext ? entries.slice(0, PAGE_SIZE) : entries;
            setHistory((prev) => replace ? page : [...prev, ...page]);
            setHasMore(hasNext);
            setOffset(nextOffset + page.length);
        } catch {
            toast.error("Failed to load history.");
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        load(0, true);
    }, [load, refreshKey]);

    return (
        <div className="space-y-1">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
                Transaction History
            </h2>
            <div className="rounded-xl border-4 border-border bg-card px-4">
                {loading && history.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
                ) : history.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">No transactions yet.</p>
                ) : (
                    <>
                        {history.map((entry, i) => {
                            const meta = REASON_LABELS[entry.reason] ?? { label: entry.reason, icon: <Minus size={14} />, positive: null };
                            const isPositive = meta.positive !== null ? meta.positive : entry.change > 0;
                            const sign = entry.change > 0 ? "+" : "";
                            return (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex items-center justify-center size-7 rounded-lg ${
                                            isPositive ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
                                        }`}>
                                            {meta.icon ?? (isPositive ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{meta.label}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {entry.created_at ? formatDate(entry.created_at) : "—"}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-mono font-semibold ${isPositive ? "text-primary" : "text-destructive"}`}>
                                        {sign}{entry.change.toLocaleString()}
                                    </span>
                                </div>
                            );
                        })}
                        {hasMore && (
                            <div className="py-3 flex justify-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => load(offset)}
                                    disabled={loading}
                                >
                                    {loading ? "Loading..." : "Load more"}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}