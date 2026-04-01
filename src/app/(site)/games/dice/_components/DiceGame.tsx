"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { playGame } from "@/lib/client/api";
import DiceDisplay from "./DiceDisplay";
import DicePicker from "./DicePicker";
import DiceResult from "./DiceResult";
import DiceBetForm from "./DiceBetForm";
import type { UseFormReturn } from "react-hook-form";

const DICE_NUMBERS = [1, 2, 3, 4, 5, 6];

const schema = z.object({
    bet: z.coerce
        .number({ error: "Bet is required" })
        .int("Must be a whole number")
        .min(5, "Minimum 5 seeds")
        .max(100_000_000, "Maximum 100,000,000 seeds"),
});

export type Schema = z.infer<typeof schema>;
type GameState = "idle" | "rolling" | "result";

export default function DiceGame() {
    const { balance, setBalance } = useUser();
    const [picked, setPicked] = useState<number | null>(null);
    const [gameState, setGameState] = useState<GameState>("idle");
    const [displayValue, setDisplayValue] = useState(1);
    const [result, setResult] = useState<{ won: boolean; delta: number; rolledValue: number } | null>(null);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { bet: 5 },
    });

    async function onRoll(values: Schema) {
        if (picked === null) {
            toast.error("Pick a number first.");
            return;
        }

        setGameState("rolling");
        setResult(null);

        try {
            const res = await playGame("GAME:DICE", values.bet);
            const { won, delta, balance: newBalance } = res.data;

            const landOn = won
                ? picked
                : (() => {
                    const others = DICE_NUMBERS.filter((n) => n !== picked);
                    return others[Math.floor(Math.random() * others.length)];
                })();

            let ticks = 0;
            const totalTicks = 18;
            const interval = setInterval(() => {
                ticks++;
                if (ticks >= totalTicks) {
                    clearInterval(interval);
                    setDisplayValue(landOn);
                    setResult({ won, delta, rolledValue: landOn });
                    setGameState("result");
                    setBalance(newBalance);
                } else {
                    setDisplayValue(DICE_NUMBERS[Math.floor(Math.random() * DICE_NUMBERS.length)]);
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
                    <h1 className="text-lg font-semibold text-foreground">Dice</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Pick a number, place your bet. Match the roll to win.{" "}
                        <span className="font-mono text-foreground">Balance: {balance.toLocaleString()}</span>
                    </p>
                </div>

                <DiceDisplay value={displayValue} rolling={gameState === "rolling"} />

                {gameState === "result" && result && (
                    <DiceResult
                        won={result.won}
                        delta={result.delta}
                        rolledValue={result.rolledValue}
                    />
                )}

                <DicePicker
                    picked={picked}
                    disabled={gameState === "rolling"}
                    onPick={setPicked}
                />

                <DiceBetForm
                    form={form as UseFormReturn<Schema, any, Schema>}
                    rolling={gameState === "rolling"}
                    noPick={picked === null}
                    onRoll={onRoll}
                />
            </div>
        </div>
    );
}