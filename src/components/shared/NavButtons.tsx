"use client";

import { useRouter } from "next/navigation";
import { Button, Typography } from "@mui/material";
import {
    Dashboard as DashboardIcon,
    Leaderboard as LeaderboardIcon,
    Person as PersonIcon,
    SwapHoriz as SwapHorizIcon,
    CardGiftcard as CardGiftcardIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";
import { showSnackbar } from "@/components/shared/SnackBar";
import useUserStore from "@/store/useUserStore";
import { useState, useEffect } from "react";
import { api } from "@/lib/client/api";

type NavButtonProps = {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    selected?: boolean;
    danger?: boolean;
};

function NavButton({ icon, label, onClick, selected = false, danger = false }: NavButtonProps) {
    return (
        <Button
            fullWidth
            onClick={onClick}
            startIcon={icon}
            sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                px: 2,
                py: 1.5,
                borderRadius: 2,
                color: danger ? "error.main" : selected ? "primary.main" : "text.secondary",
                bgcolor: selected ? "action.selected" : "transparent",
                fontWeight: selected ? 600 : 400,
                "&:hover": {
                    bgcolor: danger ? "error.main" : "action.hover",
                    color: danger ? "#fff" : "text.primary",
                },
                transition: "all 0.15s ease",
            }}
        >
            <Typography variant="body2" fontWeight="inherit" noWrap>
                {label}
            </Typography>
        </Button>
    );
}

type SelectableProps = { selected?: boolean };

export function DashboardButton({ selected }: SelectableProps) {
    const router = useRouter();
    return (
        <NavButton
            icon={<DashboardIcon />}
            label="Dashboard"
            onClick={() => router.push("/dashboard")}
            selected={selected}
        />
    );
}

export function LeaderboardButton({ selected }: SelectableProps) {
    const router = useRouter();
    return (
        <NavButton
            icon={<LeaderboardIcon />}
            label="Leaderboard"
            onClick={() => router.push("/leaderboard")}
            selected={selected}
        />
    );
}

export function TransferButton() {
    return (
        <NavButton
            icon={<SwapHorizIcon />}
            label="Transfer"
            onClick={() => showSnackbar("Transfer coming soon", "info")}
        />
    );
}

export function DailyButton() {
    const { daily, setBalance, setDaily } = useUserStore();
    const [remaining, setRemaining] = useState<number | null>(daily.remaining);

    useEffect(() => {
        setRemaining(daily.remaining);
    }, [daily.remaining]);

    useEffect(() => {
        if (!remaining) return;
        const interval = setInterval(() => {
            setRemaining((prev) => {
                if (prev === null || prev <= 1000) {
                    clearInterval(interval);
                    setDaily({ claimable: true, remaining: null });
                    return null;
                }
                return prev - 1000;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [remaining]);

    const formatRemaining = (ms: number) => {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${h}h ${m}m ${s}s`;
    };

    const handleClaim = async () => {
        try {
            const res = await api.user.daily.claim();
            const { claimed, balance } = res.data.data;
            setBalance(balance);
            setDaily({ claimable: false, remaining: 24 * 60 * 60 * 1000 });
            setRemaining(24 * 60 * 60 * 1000);
            showSnackbar(`+${claimed} seeds claimed!`, "success");
        } catch (error: any) {
            showSnackbar(error, "error");
        }
    };

    const isLoading = daily.claimable === null;
    const claimable = daily.claimable === true;

    return (
        <Button
            fullWidth
            onClick={claimable ? handleClaim : undefined}
            startIcon={<CardGiftcardIcon />}
            disabled={isLoading || !claimable}
            sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                px: 2,
                py: 1.5,
                borderRadius: 2,
                color: claimable ? "primary.main" : "text.secondary",
                fontWeight: claimable ? 600 : 400,
                bgcolor: "transparent",
                "&:hover": {
                    bgcolor: claimable ? "action.hover" : "transparent",
                    color: claimable ? "text.primary" : "text.secondary",
                },
                transition: "all 0.15s ease",
                ...(claimable && {
                    "@keyframes pulse": {
                        "0%, 100%": { opacity: 1 },
                        "50%": { opacity: 0.6 },
                    },
                    animation: "pulse 2s ease-in-out infinite",
                }),
            }}
        >
            <Typography variant="body2" fontWeight="inherit" noWrap>
                {isLoading
                    ? "..."
                    : claimable
                    ? "Claim Daily"
                    : remaining !== null
                    ? formatRemaining(remaining)
                    : "Claim Daily"}
            </Typography>
        </Button>
    );
}

export function LogoutButton() {
    const { logout } = useUserStore();
    return (
        <NavButton
            icon={<LogoutIcon />}
            label="Logout"
            onClick={logout}
            danger
        />
    );
}