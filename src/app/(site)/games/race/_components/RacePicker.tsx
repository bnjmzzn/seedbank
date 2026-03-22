"use client";

import { cn } from "@/lib/utils";
import { RACERS, type RacerId } from "./RaceTrack";

interface Props {
    picked: RacerId | null;
    disabled: boolean;
    onPick: (id: RacerId) => void;
}

export default function RacePicker({ picked, disabled, onPick }: Props) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Pick your racer</p>
            <div className="grid grid-cols-4 gap-2">
                {RACERS.map((racer) => (
                    <button
                        key={racer.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => onPick(racer.id)}
                        className={cn(
                            "flex flex-col items-center gap-1.5 rounded-lg p-3 border-2 transition-all duration-150",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            picked === racer.id
                                ? "border-primary bg-primary/10"
                                : "border-border bg-muted hover:border-primary/40"
                        )}
                    >
                        <span className="text-2xl leading-none">{racer.emoji}</span>
                        <span className="text-xs font-semibold text-foreground">{racer.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}