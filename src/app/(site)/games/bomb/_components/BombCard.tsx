"use client";

import { cn } from "@/lib/utils";

interface Props {
    revealed: boolean;
    isBomb: boolean | null;
    disabled: boolean;
    onClick: () => void;
}

export default function BombCard({ revealed, isBomb, disabled, onClick }: Props) {
    return (
        <button
            type="button"
            disabled={disabled || revealed}
            onClick={onClick}
            className="group w-full aspect-square"
            style={{ perspective: "600px" }}
        >
            <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                    transformStyle: "preserve-3d",
                    transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-xl border-4 border-border bg-muted",
                        "flex items-center justify-center",
                        "transition-all duration-150",
                        !disabled && !revealed && "group-hover:border-primary/40 group-hover:bg-accent group-hover:-translate-y-0.5",
                        "cursor-pointer disabled:cursor-not-allowed"
                    )}
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <span className="text-3xl select-none">?</span>
                </div>
                <div
                    className={cn(
                        "absolute inset-0 rounded-xl border-4 flex items-center justify-center",
                        isBomb
                            ? "border-destructive/50 bg-destructive/10"
                            : "border-primary/50 bg-primary/10"
                    )}
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    <span className="text-4xl select-none">
                        {isBomb === true ? "💣" : isBomb === false ? "✅" : null}
                    </span>
                </div>
            </div>
        </button>
    );
}