"use client";

import { cn } from "@/lib/utils";

interface Props {
    won: boolean;
    delta: number;
}

export default function BombResult({ won, delta }: Props) {
    return (
        <div className={cn(
            "rounded-lg px-4 py-3 text-sm font-medium text-center",
            won ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
        )}>
            {won
                ? `Safe! Won ${delta.toLocaleString()} seeds.`
                : `Boom! Lost ${Math.abs(delta).toLocaleString()} seeds.`
            }
        </div>
    );
}