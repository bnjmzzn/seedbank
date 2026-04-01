"use client";

import { cn } from "@/lib/utils";
import { RACERS, type RacerId } from "./RaceTrack";

interface Props {
    won: boolean;
    delta: number;
    winner: RacerId;
}

export default function RaceResult({ won, delta, winner }: Props) {
    const racer = RACERS.find((r) => r.id === winner)!;

    return (
        <div className={cn(
            "rounded-lg px-4 py-3 text-sm font-medium text-center flex items-center justify-center gap-2",
            won ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
        )}>
            <span className="text-base">{racer.emoji}</span>
            {won
                ? `${racer.label} wins! Won ${delta.toLocaleString()} seeds.`
                : `${racer.label} wins. Lost ${Math.abs(delta).toLocaleString()} seeds.`
            }
        </div>
    );
}