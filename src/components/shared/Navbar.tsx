"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bean, User, ArrowLeftRight, Trophy, LogOut } from "lucide-react";
import Logo from "@/components/shared/Logo";

function dicebearUrl(username: string) {
    return `https://api.dicebear.com/9.x/bottts/svg?seed=${username}`;
}

function BalanceBadge({ balance }: { balance: number }) {
    return (
        <Badge variant="secondary" className="text-yellow-300 p-4 flex items-center gap-1 font-mono text-md">
            <Bean size={12} />
            {balance.toLocaleString()}
        </Badge>
    );
}

function UserAvatar({ username }: { username: string }) {
    return (
        <Avatar className="size-8 ring-2 ring-primary ring-offset-2 ring-offset-background">
            <AvatarImage src={dicebearUrl(username)} alt={username} />
        </Avatar>
    );
}

function UserDropdown({ username, logout }: { username: string; logout: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none">
                    <UserAvatar username={username} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex items-center gap-2">
                        <User size={14} className="text-muted-foreground" />
                        {username}
                    </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={`/profile/${username}`}>
                            <User size={14} /> Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/transfer">
                            <ArrowLeftRight size={14} /> Transfer
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/leaderboard">
                            <Trophy size={14} /> Leaderboard
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive" onClick={logout}>
                        <LogOut size={14} /> Logout
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function Navbar() {
    const { username, balance, logout } = useUser();

    return (
        <nav className="flex items-center justify-between px-6 h-14 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
                <Logo size={28} />
            </Link>
            <div className="flex items-center gap-4">
                <BalanceBadge balance={balance} />
                <UserDropdown username={username} logout={logout} />
            </div>
        </nav>
    );
}