"use client";

import { cn } from "@/lib/utils";

export const RACERS = [
    { id: "rabbit", label: "Rabbit", emoji: "🐰" },
    { id: "turtle", label: "Turtle", emoji: "🐢" },
    { id: "bean",   label: "Bean",   emoji: "🫘" },
    { id: "snail",  label: "Snail",  emoji: "🐌" },
] as const;

export type RacerId = typeof RACERS[number]["id"];

interface Props {
    positions: Record<RacerId, number>;
    picked: RacerId | null;
    winner: RacerId | null;
}

export default function RaceTrack({ positions, picked, winner }: Props) {
    return (
        <div className="space-y-2">
            {RACERS.map((racer) => (
                <div key={racer.id} className="flex items-center gap-2">
                    <span className={cn(
                        "text-xs font-semibold w-12 shrink-0 text-right transition-colors",
                        winner === null && picked === racer.id && "text-primary",
                        winner === null && picked !== racer.id && "text-muted-foreground",
                        winner !== null && winner === racer.id && "text-primary",
                        winner !== null && winner !== racer.id && "text-destructive",
                    )}>
                        {racer.label}
                    </span>
                    <div className="relative flex-1 h-10 rounded-lg border-2 border-border bg-muted/40">
                        <div
                            className="absolute top-0 bottom-0 flex items-center transition-none"
                            style={{ left: `${positions[racer.id]}%` }}
                        >
                            <span className={cn(
                                "text-xl leading-none -translate-x-1/2 select-none",
                                winner === racer.id && "animate-spin"
                            )}>
                                {racer.emoji}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}