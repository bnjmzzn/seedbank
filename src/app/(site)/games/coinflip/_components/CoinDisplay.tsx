"use client";

import { cn } from "@/lib/utils";
import CoinFace from "./CoinFace";

interface Props {
    side: "bean" | "nobean";
    flipping: boolean;
}

export default function CoinDisplay({ side, flipping }: Props) {
    return (
        <div className="flex justify-center">
            <div className={cn(
                "transition-transform",
                flipping && "animate-bounce"
            )}>
                <CoinFace
                    side={side}
                    size={120}
                    className={cn(
                        "transition-all duration-75",
                        flipping && "filter-[drop-shadow(0_0_14px_hsl(var(--primary)/0.4))]"
                    )}
                />
            </div>
        </div>
    );
}