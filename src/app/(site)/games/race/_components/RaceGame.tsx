"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { playGame } from "@/lib/client/api";
import RaceTrack, { RACERS, type RacerId } from "./RaceTrack";
import RacePicker from "./RacePicker";
import RaceResult from "./RaceResult";
import RaceBetForm from "./RaceBetForm";
import type { UseFormReturn } from "react-hook-form";

const schema = z.object({
    bet: z.coerce
        .number({ error: "Bet is required" })
        .int("Must be a whole number")
        .min(5, "Minimum 5 seeds")
        .max(100_000_000, "Maximum 100,000,000 seeds"),
});

export type Schema = z.infer<typeof schema>;
type GameState = "idle" | "racing" | "result";

const INITIAL_POSITIONS = () =>
    Object.fromEntries(RACERS.map((r) => [r.id, 2])) as Record<RacerId, number>;

const FINISH = 95;
const TICK_MS = 80;
const BOOST_CHANCE = 0.18;
const STUMBLE_CHANCE = 0.1;

export default function RaceGame() {
    const { balance, setBalance } = useUser();
    const [picked, setPicked] = useState<RacerId | null>(null);
    const [gameState, setGameState] = useState<GameState>("idle");
    const [positions, setPositions] = useState<Record<RacerId, number>>(INITIAL_POSITIONS());
    const [winner, setWinner] = useState<RacerId | null>(null);
    const [result, setResult] = useState<{ won: boolean; delta: number; winner: RacerId } | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { bet: 5 },
    });

    async function onRace(values: Schema) {
        if (picked === null) {
            toast.error("Pick a racer first.");
            return;
        }

        setGameState("racing");
        setResult(null);
        setWinner(null);
        setPositions(INITIAL_POSITIONS());

        try {
            const res = await playGame("GAME:RACE", values.bet);
            const { won, delta, balance: newBalance } = res.data;

            const winnerId: RacerId = won
                ? picked
                : RACERS.map((r) => r.id).filter((id) => id !== picked)[
                    Math.floor(Math.random() * (RACERS.length - 1))
                ];

            const pos = { ...INITIAL_POSITIONS() };
            const finished = new Set<RacerId>();

            intervalRef.current = setInterval(() => {
                const remainingIds = RACERS.map((r) => r.id).filter((id) => !finished.has(id));

                for (const id of remainingIds) {
                    const isWinner = id === winnerId;
                    const allOthersAhead = remainingIds
                        .filter((o) => o !== id)
                        .every((o) => pos[o] >= pos[id]);

                    let step = 0.8 + Math.random() * 2.2;

                    if (Math.random() < BOOST_CHANCE) step += 2 + Math.random() * 2;
                    if (Math.random() < STUMBLE_CHANCE) step = Math.max(0, step - 1.5);

                    if (isWinner && pos[id] > FINISH - 12 && allOthersAhead) {
                        step += 1.5 + Math.random();
                    }

                    if (!isWinner && pos[id] >= FINISH - 5) {
                        step = 0;
                    }

                    pos[id] = Math.min(pos[id] + step, isWinner ? FINISH : FINISH - 3);

                    if (pos[id] >= FINISH && !finished.has(id)) {
                        finished.add(id);
                    }
                }

                setPositions({ ...pos });

                if (finished.has(winnerId)) {
                    clearInterval(intervalRef.current!);
                    setWinner(winnerId);
                    setBalance(newBalance);
                    setResult({ won, delta, winner: winnerId });
                    setGameState("result");
                }
            }, TICK_MS);
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
                    <h1 className="text-lg font-semibold text-foreground">Race</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Pick a racer and bet on them to win.{" "}
                        <span className="font-mono text-foreground">Balance: {balance.toLocaleString()}</span>
                    </p>
                </div>

                <RaceTrack positions={positions} picked={picked} winner={winner} />

                {gameState === "result" && result && (
                    <RaceResult
                        won={result.won}
                        delta={result.delta}
                        winner={result.winner}
                    />
                )}

                <RacePicker
                    picked={picked}
                    disabled={gameState === "racing"}
                    onPick={setPicked}
                />

                <RaceBetForm
                    form={form as UseFormReturn<Schema, any, Schema>}
                    racing={gameState === "racing"}
                    noPick={picked === null}
                    onRace={onRace}
                />
            </div>
        </div>
    );
}