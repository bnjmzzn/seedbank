"use client";

import { cn } from "@/lib/utils";

interface Props {
    won: boolean;
    delta: number;
    landedOn: "bean" | "nobean";
}

export default function CoinResult({ won, delta, landedOn }: Props) {
    return (
        <div className={cn(
            "rounded-lg px-4 py-3 text-sm font-medium text-center",
            won ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
        )}>
            {won
                ? `${landedOn === "bean" ? "Bean" : "No Bean"}! Won ${delta.toLocaleString()} seeds.`
                : `${landedOn === "bean" ? "Bean" : "No Bean"}. Lost ${Math.abs(delta).toLocaleString()} seeds.`
            }
        </div>
    );
}