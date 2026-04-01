"use client";

import { cn } from "@/lib/utils";

interface Props {
    won: boolean;
    delta: number;
    rolledValue: number;
}

export default function DiceResult({ won, delta, rolledValue }: Props) {
    return (
        <div className={cn(
            "rounded-lg px-4 py-3 text-sm font-medium text-center",
            won ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
        )}>
            {won
                ? `You rolled ${rolledValue}! Won ${delta.toLocaleString()} seeds.`
                : `You rolled ${rolledValue}. Lost ${Math.abs(delta).toLocaleString()} seeds.`
            }
        </div>
    );
}