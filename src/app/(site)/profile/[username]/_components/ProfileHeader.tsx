"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Bean, Trophy, Calendar } from "lucide-react";

interface Props {
    username: string;
    balance: number;
    rank: number;
    createdAt: string;
}

function dicebearUrl(username: string) {
    return `https://api.dicebear.com/9.x/bottts/svg?seed=${username}`;
}

function formatJoinDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export default function ProfileHeader({ username, balance, rank, createdAt }: Props) {
    return (
        <div className="rounded-xl border-4 border-border bg-card p-6 space-y-5">
            <div className="flex items-center gap-4">
                <Avatar className="size-16 ring-2 ring-primary ring-offset-2 ring-offset-background">
                    <AvatarImage src={dicebearUrl(username)} alt={username} />
                </Avatar>
                <div>
                    <h1 className="text-xl font-bold text-foreground">{username}</h1>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                        <Calendar size={13} />
                        <span>Joined {formatJoinDate(createdAt)}</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted p-4 space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Balance</p>
                    <div className="flex items-center gap-1.5 text-foreground font-mono font-semibold text-lg">
                        <Bean size={16} className="text-primary" />
                        {balance.toLocaleString()}
                    </div>
                </div>
                <div className="rounded-lg bg-muted p-4 space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Rank</p>
                    <div className="flex items-center gap-1.5 text-foreground font-mono font-semibold text-lg">
                        <Trophy size={16} className="text-primary" />
                        #{rank}
                    </div>
                </div>
            </div>
        </div>
    );
}