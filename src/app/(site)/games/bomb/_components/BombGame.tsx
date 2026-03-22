"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { playGame } from "@/lib/client/api";
import BombGrid from "./BombGrid";
import BombBetForm from "./BombBetForm";
import BombResult from "./BombResult";
import type { UseFormReturn } from "react-hook-form";

const schema = z.object({
    bet: z.coerce
        .number({ error: "Bet is required" })
        .int("Must be a whole number")
        .min(5, "Minimum 5 seeds")
        .max(100_000_000, "Maximum 100,000,000 seeds"),
});

export type Schema = z.infer<typeof schema>;
type GameState = "idle" | "picking" | "revealing" | "result";

function generateLayout(won: boolean, pickedIndex: number): boolean[] {
    const bombCount = Math.floor(Math.random() * 2) + 1;

    if (won) {
        const others = [0, 1, 2].filter((i) => i !== pickedIndex);
        const layout = Array(3).fill(false);
        const shuffled = others.sort(() => Math.random() - 0.5);
        shuffled.slice(0, bombCount).forEach((i) => { layout[i] = true; });
        return layout;
    } else {
        const layout = Array(3).fill(false);
        layout[pickedIndex] = true;
        [0, 1, 2].filter((i) => i !== pickedIndex).forEach((i) => {
            layout[i] = Math.random() < 0.5;
        });
        return layout;
    }
}

export default function BombGame() {
    const { balance, setBalance } = useUser();
    const [gameState, setGameState] = useState<GameState>("idle");
    const [bombs, setBombs] = useState<(boolean | null)[]>([null, null, null]);
    const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
    const [pendingResult, setPendingResult] = useState<{ won: boolean; delta: number; newBalance: number; pickedIndex: number } | null>(null);
    const [result, setResult] = useState<{ won: boolean; delta: number } | null>(null);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { bet: 5 },
    });

    async function onBet(values: Schema) {
        setGameState("picking");
        setResult(null);
        setBombs([null, null, null]);
        setRevealed([false, false, false]);
        setPendingResult(null);

        try {
            const res = await playGame("GAME:BOMB", values.bet);
            const { won, delta, balance: newBalance } = res.data;
            
            setPendingResult({ won, delta, newBalance, pickedIndex: -1 });
        } catch (err: any) {
            const code = err.response?.data?.code;
            const messages: Record<string, string> = {
                INSUFFICIENT_BALANCE: "Not enough seeds.",
                INVALID_BODY:         "Invalid bet.",
            };
            toast.error(messages[code] ?? "Something went wrong.");
            setGameState("idle");
        }
    }

    function onPick(index: number) {
        if (!pendingResult || gameState !== "picking") return;

        setGameState("revealing");
        const layout = generateLayout(pendingResult.won, index);
        setBombs(layout);

        const newRevealed = [false, false, false];
        newRevealed[index] = true;
        setRevealed(newRevealed);

        setTimeout(() => {
            setRevealed([true, true, true]);
            setTimeout(() => {
                setBalance(pendingResult.newBalance);
                setResult({ won: pendingResult.won, delta: pendingResult.delta });
                setGameState("result");
            }, 600);
        }, 600);
    }

    return (
        <div className="mx-auto w-full max-w-lg px-6 py-8">
            <div className="rounded-xl border-4 border-border bg-card p-6 space-y-6">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">Bomb</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Place a bet, then pick a card. Avoid the bomb.{" "}
                        <span className="font-mono text-foreground">Balance: {balance.toLocaleString()}</span>
                    </p>
                </div>

                <BombGrid
                    revealed={revealed}
                    bombs={bombs}
                    disabled={gameState !== "picking"}
                    onPick={onPick}
                />

                {gameState === "result" && result && (
                    <BombResult won={result.won} delta={result.delta} />
                )}

                <BombBetForm
                form={form as UseFormReturn<Schema, any, Schema>}
                playing={gameState === "picking" || gameState === "revealing"}
                onBet={onBet}
                />
            </div>
        </div>
    );
}