"use client";

import { cn } from "@/lib/utils";
import DiceFace from "./DiceFace";

const DICE_NUMBERS = [1, 2, 3, 4, 5, 6];

interface Props {
    picked: number | null;
    disabled: boolean;
    onPick: (n: number) => void;
}

export default function DicePicker({ picked, disabled, onPick }: Props) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Pick a number</p>
            <div className="grid grid-cols-6 gap-2">
                {DICE_NUMBERS.map((n) => (
                    <button
                        key={n}
                        type="button"
                        disabled={disabled}
                        onClick={() => onPick(n)}
                        className={cn(
                            "flex items-center justify-center rounded-lg p-1.5 border-2 transition-all duration-150",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            picked === n
                                ? "border-primary bg-primary/10"
                                : "border-border bg-muted hover:border-primary/40"
                        )}
                    >
                        <DiceFace value={n} size={44} />
                    </button>
                ))}
            </div>
        </div>
    );
}