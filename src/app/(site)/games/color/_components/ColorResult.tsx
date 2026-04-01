"use client";

import { cn } from "@/lib/utils";
import { COLORS, type ColorId } from "./ColorCube";

interface Props {
    won: boolean;
    delta: number;
    landedOn: ColorId;
}

export default function ColorResult({ won, delta, landedOn }: Props) {
    const color = COLORS.find((c) => c.id === landedOn)!;

    return (
        <div className={cn(
            "rounded-lg px-4 py-3 text-sm font-medium text-center flex items-center justify-center gap-2",
            won ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
        )}>
            <div className="size-3 rounded-sm shrink-0" style={{ backgroundColor: color.hex }} />
            {won
                ? `${color.label}! Won ${delta.toLocaleString()} seeds.`
                : `${color.label}. Lost ${Math.abs(delta).toLocaleString()} seeds.`
            }
        </div>
    );
}