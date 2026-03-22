"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Shuffle, Dice5, Palette, Bomb, Flag, Swords, Bean } from "lucide-react";
import { toast } from "sonner";
import ActionCard from "@/app/(site)/dashboard/_components/ActionCard";
import { useUser } from "@/context/UserContext";
import api from "@/lib/client/axios";

const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const GAMES = [
    { key: "coinflip", label: "Coinflip", icon: <Shuffle size={28} /> },
    { key: "dice", label: "Dice", icon: <Dice5 size={28} /> },
    { key: "color", label: "Color Pick", icon: <Palette size={28} /> },
    { key: "bomb", label: "Bomb", icon: <Bomb size={28} /> },
    { key: "race", label: "Race", icon: <Flag size={28} /> },
    { key: "steal", label: "Steal", icon: <Swords size={28} /> },
];

function getDailyState(key: string): { available: boolean; remaining: number } {
    if (typeof window === "undefined") return { available: false, remaining: 0 };
    const raw = localStorage.getItem(key);
    if (!raw) return { available: true, remaining: 0 };
    const lastClaim = parseInt(raw, 10);
    if (isNaN(lastClaim)) return { available: true, remaining: 0 };
    const remaining = DAILY_COOLDOWN_MS - (Date.now() - lastClaim);
    return remaining > 0
        ? { available: false, remaining }
        : { available: true, remaining: 0 };
}

function formatRemaining(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
}

export default function DashboardPage() {
    const router = useRouter();
    const { username, setBalance } = useUser();

    const dailyKey = `daily_last_claim_${username}`;

    const [dailyAvailable, setDailyAvailable] = useState(false);
    const [dailyRemaining, setDailyRemaining] = useState(0);
    const [claiming, setClaiming] = useState(false);

    useEffect(() => {
        function tick() {
            const { available, remaining } = getDailyState(dailyKey);
            setDailyAvailable(available);
            setDailyRemaining(remaining);
        }
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [dailyKey]);

    const handleClaimDaily = useCallback(async () => {
        const { available, remaining } = getDailyState(dailyKey);
        if (!available) {
            toast.info(`Come back in ${formatRemaining(remaining)}`);
            return;
        }

        setClaiming(true);
        try {
            const res = await api.post("/api/daily");
            const { claimed, balance } = res.data.data;
            localStorage.setItem(dailyKey, Date.now().toString());
            setBalance(balance);
            toast.success(`Claimed ${claimed.toLocaleString()} seeds!`);
        } catch (err: any) {
            const code = err.response?.data?.code;
            if (code === "COOLDOWN_ACTIVE") {
                const remaining = err.response?.data?.data?.remaining;
                if (remaining) {
                    localStorage.setItem(
                        dailyKey,
                        (Date.now() - (DAILY_COOLDOWN_MS - remaining)).toString()
                    );
                }
                toast.info("Already claimed. Try again later.");
            } else {
                toast.error("Something went wrong.");
            }
        } finally {
            setClaiming(false);
        }
    }, [dailyKey, setBalance]);

    return (
        <div className="mx-auto w-full max-w-4xl px-6 py-8 space-y-10">
            <section className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Actions
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                    <ActionCard
                        icon={<Bean size={28} />}
                        title={
                            claiming
                                ? "Claiming..."
                                : dailyAvailable
                                ? "Daily Claim"
                                : `${formatRemaining(dailyRemaining)}`
                        }
                        onClick={handleClaimDaily}
                        className={!dailyAvailable ? "opacity-60" : undefined}
                    />
                    <ActionCard
                        icon={<ArrowLeftRight size={28} />}
                        title="Transfer"
                        onClick={() => router.push("/transfer")}
                    />
                </div>
            </section>
            <section className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Games
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {GAMES.map((game) => (
                        <ActionCard
                            key={game.key}
                            icon={game.icon}
                            title={game.label}
                            onClick={() => router.push(`/games/${game.key}`)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}