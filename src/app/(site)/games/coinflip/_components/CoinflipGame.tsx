"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { playGame } from "@/lib/client/api";
import CoinDisplay from "./CoinDisplay";
import CoinPicker from "./CoinPicker";
import CoinResult from "./CoinResult";
import CoinBetForm from "./CoinBetForm";
import type { UseFormReturn } from "react-hook-form";

const SIDES = ["bean", "nobean"] as const;
type Side = typeof SIDES[number];

const schema = z.object({
    bet: z.coerce
        .number({ error: "Bet is required" })
        .int("Must be a whole number")
        .min(5, "Minimum 5 seeds")
        .max(100_000_000, "Maximum 100,000,000 seeds"),
});

export type Schema = z.infer<typeof schema>;
type GameState = "idle" | "flipping" | "result";

export default function CoinflipGame() {
    const { balance, setBalance } = useUser();
    const [picked, setPicked] = useState<Side | null>(null);
    const [gameState, setGameState] = useState<GameState>("idle");
    const [displaySide, setDisplaySide] = useState<Side>("bean");
    const [result, setResult] = useState<{ won: boolean; delta: number; landedOn: Side } | null>(null);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { bet: 5 },
    });

    async function onFlip(values: Schema) {
        if (picked === null) {
            toast.error("Pick a side first.");
            return;
        }

        setGameState("flipping");
        setResult(null);

        try {
            const res = await playGame("GAME:COINFLIP", values.bet);
            const { won, delta, balance: newBalance } = res.data;

            const landedOn: Side = won
                ? picked
                : SIDES.find((s) => s !== picked)!;

            let ticks = 0;
            const totalTicks = 16;
            const interval = setInterval(() => {
                ticks++;
                if (ticks >= totalTicks) {
                    clearInterval(interval);
                    setDisplaySide(landedOn);
                    setBalance(newBalance);
                    setResult({ won, delta, landedOn });
                    setGameState("result");
                } else {
                    setDisplaySide(SIDES[ticks % 2]);
                }
            }, 80);
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

    return (
        <div className="mx-auto w-full max-w-lg px-6 py-8">
            <div className="rounded-xl border-4 border-border bg-card p-6 space-y-6">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">Coinflip</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Pick a side, place your bet. 50/50 chance to win.{" "}
                        <span className="font-mono text-foreground">Balance: {balance.toLocaleString()}</span>
                    </p>
                </div>

                <CoinDisplay side={displaySide} flipping={gameState === "flipping"} />

                {gameState === "result" && result && (
                    <CoinResult
                        won={result.won}
                        delta={result.delta}
                        landedOn={result.landedOn}
                    />
                )}

                <CoinPicker
                    picked={picked}
                    disabled={gameState === "flipping"}
                    onPick={setPicked}
                />

                <CoinBetForm
                    form={form as UseFormReturn<Schema, any, Schema>}
                    flipping={gameState === "flipping"}
                    noPick={picked === null}
                    onFlip={onFlip}
                />
            </div>
        </div>
    );
}