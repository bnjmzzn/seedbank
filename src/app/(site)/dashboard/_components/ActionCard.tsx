"use client";

import { cn } from "@/lib/utils";

interface ActionCardProps {
    icon: React.ReactNode;
    title: string;
    onClick?: () => void;
    className?: string;
}

export default function ActionCard({ icon, title, onClick, className }: ActionCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group flex flex-col items-center justify-center gap-3 rounded-xl p-6 w-full",
                "border-4 border-border bg-card",
                "transition-all duration-150",
                "hover:border-primary/40 hover:bg-accent hover:-translate-y-0.5 hover:shadow-lg",
                "active:translate-y-0 active:shadow-none",
                "cursor-pointer",
                className
            )}
        >
            <div className={cn(
                "flex items-center justify-center rounded-xl size-16",
                "bg-muted text-muted-foreground",
                "transition-colors duration-150",
                "group-hover:bg-primary/15 group-hover:text-primary",
            )}>
                {icon}
            </div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
        </button>
    );
}