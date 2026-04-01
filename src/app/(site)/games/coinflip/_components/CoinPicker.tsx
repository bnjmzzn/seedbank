"use client";

import { cn } from "@/lib/utils";
import CoinFace from "./CoinFace";

interface Props {
    picked: "bean" | "nobean" | null;
    disabled: boolean;
    onPick: (side: "bean" | "nobean") => void;
}

export default function CoinPicker({ picked, disabled, onPick }: Props) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Pick a side</p>
            <div className="grid grid-cols-2 gap-3">
                {(["bean", "nobean"] as const).map((side) => (
                    <button
                        key={side}
                        type="button"
                        disabled={disabled}
                        onClick={() => onPick(side)}
                        className={cn(
                            "flex flex-col items-center gap-2 rounded-lg p-3 border-2 transition-all duration-150",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            picked === side
                                ? "border-primary bg-primary/10"
                                : "border-border bg-muted hover:border-primary/40"
                        )}
                    >
                        <CoinFace side={side} size={56} />
                        <span className="text-xs font-semibold text-foreground capitalize">
                            {side === "bean" ? "Bean" : "No Bean"}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}