"use client";

import { cn } from "@/lib/utils";
import DiceFace from "./DiceFace";

interface Props {
    value: number;
    rolling: boolean;
}

export default function DiceDisplay({ value, rolling }: Props) {
    return (
        <div className="flex justify-center">
            <div className={cn("transition-transform", rolling && "animate-bounce")}>
                <DiceFace
                    value={value}
                    size={120}
                    className={cn(
                        "transition-all duration-100",
                        rolling && "filter-[drop-shadow(0_0_12px_hsl(var(--primary)/0.4))]"
                    )}
                />
            </div>
        </div>
    );
}