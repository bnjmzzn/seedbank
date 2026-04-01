"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { playGame } from "@/lib/client/api";
import ColorCube, { COLORS, type ColorId } from "./ColorCube";
import ColorPicker from "./ColorPicker";
import ColorResult from "./ColorResult";
import ColorBetForm from "./ColorBetForm";
import type { UseFormReturn } from "react-hook-form";

const schema = z.object({
    bet: z.coerce
        .number({ error: "Bet is required" })
        .int("Must be a whole number")
        .min(5, "Minimum 5 seeds")
        .max(100_000_000, "Maximum 100,000,000 seeds"),
});

export type Schema = z.infer<typeof schema>;
type GameState = "idle" | "rolling" | "result";

export default function ColorGame() {
    const { balance, setBalance } = useUser();
    const [picked, setPicked] = useState<ColorId | null>(null);
    const [gameState, setGameState] = useState<GameState>("idle");
    const [result, setResult] = useState<{ won: boolean; delta: number; landedOn: ColorId } | null>(null);
    const [cubeResult, setCubeResult] = useState<ColorId | null>(null);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { bet: 5 },
    });

    async function onRoll(values: Schema) {
        if (picked === null) {
            toast.error("Pick a color first.");
            return;
        }

        setGameState("rolling");
        setResult(null);
        setCubeResult(null);

        try {
            const res = await playGame("GAME:COLOR", values.bet);
            const { won, delta, balance: newBalance } = res.data;

            const landedOn: ColorId = won
                ? picked
                : COLORS.map((c) => c.id).filter((id) => id !== picked)[
                    Math.floor(Math.random() * (COLORS.length - 1))
                ];

            setTimeout(() => {
                setCubeResult(landedOn);
                setTimeout(() => {
                    setBalance(newBalance);
                    setResult({ won, delta, landedOn });
                    setGameState("result");
                }, 700);
            }, 1500);
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
                    <h1 className="text-lg font-semibold text-foreground">Color</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Pick a color, roll the cube. Match the top face to win.{" "}
                        <span className="font-mono text-foreground">Balance: {balance.toLocaleString()}</span>
                    </p>
                </div>

                <ColorCube result={cubeResult} rolling={gameState === "rolling"} />

                {gameState === "result" && result && (
                    <ColorResult
                        won={result.won}
                        delta={result.delta}
                        landedOn={result.landedOn}
                    />
                )}

                <ColorPicker
                    picked={picked}
                    disabled={gameState === "rolling"}
                    onPick={setPicked}
                />

                <ColorBetForm
                    form={form as UseFormReturn<Schema, any, Schema>}
                    rolling={gameState === "rolling"}
                    noPick={picked === null}
                    onRoll={onRoll}
                />
            </div>
        </div>
    );
}