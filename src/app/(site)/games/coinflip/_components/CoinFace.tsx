"use client";

import { Bean } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    side: "bean" | "nobean";
    size?: number;
    className?: string;
}

export default function CoinFace({ side, size = 100, className = "" }: Props) {
    return (
        <div
            style={{ width: size, height: size }}
            className={cn(
                "rounded-full flex items-center justify-center border-4 border-border",
                side === "bean" ? "bg-primary/20" : "bg-muted",
                className
            )}
        >
            {side === "bean" ? (
                <Bean
                    style={{ width: size * 0.45, height: size * 0.45 }}
                    className="text-primary"
                />
            ) : (
                <span
                    style={{ fontSize: size * 0.32 }}
                    className="font-bold font-mono text-muted-foreground select-none"
                >
                    ?
                </span>
            )}
        </div>
    );
}