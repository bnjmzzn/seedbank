"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trophy, Bean } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/client/axios";
import { fetchProfile } from "@/lib/client/api";
import { useUser } from "@/context/UserContext";
import type { LeaderboardEntry } from "@/types/database";
import type { UserProfile } from "@/types/database";

function dicebearUrl(username: string) {
    return `https://api.dicebear.com/9.x/bottts/svg?seed=${username}`;
}

const RANK_COLORS: Record<number, string> = {
    1: "text-yellow-400",
    2: "text-slate-400",
    3: "text-amber-600",
};

function LeaderboardRow({ entry, highlight = false }: { entry: LeaderboardEntry; highlight?: boolean }) {
    return (
        <Link
            href={`/profile/${entry.username}`}
            className={`flex items-center justify-between py-3 border-b border-border last:border-0 hover:opacity-80 transition-opacity ${
                highlight ? "opacity-100" : ""
            }`}
        >
            <div className="flex items-center gap-3">
                <span className={`w-6 text-center text-sm font-bold font-mono ${RANK_COLORS[entry.rank] ?? "text-muted-foreground"}`}>
                    {entry.rank <= 3 ? <Trophy size={16} className="mx-auto" /> : `#${entry.rank}`}
                </span>
                <Avatar className="size-8 ring-2 ring-primary/30 ring-offset-1 ring-offset-background">
                    <AvatarImage src={dicebearUrl(entry.username)} alt={entry.username} />
                </Avatar>
                <p className="text-sm font-medium text-foreground">{entry.username}</p>
            </div>
            <div className="flex items-center gap-1.5 font-mono font-semibold text-sm text-foreground">
                <Bean size={13} className="text-primary" />
                {entry.balance.toLocaleString()}
            </div>
        </Link>
    );
}

export default function LeaderboardPage() {
    const { username } = useUser();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [ownEntry, setOwnEntry] = useState<LeaderboardEntry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [lbRes, profileRes] = await Promise.all([
                    api.get("/api/leaderboard"),
                    fetchProfile(username),
                ]);
                const top10: LeaderboardEntry[] = lbRes.data.data.slice(0, 10);
                setEntries(top10);

                const profile: UserProfile = profileRes.data;
                setOwnEntry({
                    rank: profile.rank,
                    username: profile.username,
                    balance: profile.balance ?? 0,
                });
            } catch {
                toast.error("Failed to load leaderboard.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [username]);

    return (
        <div className="mx-auto w-full max-w-lg px-6 py-8 space-y-4">
            {!loading && ownEntry && (
                <div className="space-y-1">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
                        Your Rank
                    </h2>
                    <div className="rounded-xl border-4 border-primary/30 bg-card px-4">
                        <LeaderboardRow entry={ownEntry} highlight />
                    </div>
                </div>
            )}
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
                Leaderboard
            </h2>
            <div className="rounded-xl border-4 border-border bg-card px-4">
                {loading ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
                ) : entries.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">No entries yet.</p>
                ) : (
                    entries.map((entry) => (
                        <LeaderboardRow
                            key={entry.rank}
                            entry={entry}
                            highlight={entry.username === username}
                        />
                    ))
                )}
            </div>
        </div>
    );
}