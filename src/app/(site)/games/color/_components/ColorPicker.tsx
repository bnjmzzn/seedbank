"use client";

import { cn } from "@/lib/utils";
import { COLORS, type ColorId } from "./ColorCube";

interface Props {
    picked: ColorId | null;
    disabled: boolean;
    onPick: (id: ColorId) => void;
}

export default function ColorPicker({ picked, disabled, onPick }: Props) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Pick a color</p>
            <div className="grid grid-cols-6 gap-2">
                {COLORS.map((color) => (
                    <button
                        key={color.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => onPick(color.id)}
                        className={cn(
                            "flex flex-col items-center gap-1.5 rounded-lg p-2 border-2 transition-all duration-150",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            picked === color.id
                                ? "border-primary bg-primary/10"
                                : "border-border bg-muted hover:border-primary/40"
                        )}
                    >
                        <div
                            className="rounded-md size-7"
                            style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[10px] font-semibold text-muted-foreground">
                            {color.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}