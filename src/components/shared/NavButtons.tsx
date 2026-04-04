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
    return (
        <NavButton
            icon={<CardGiftcardIcon />}
            label="Claim Daily"
            onClick={() => showSnackbar("Daily claim coming soon", "info")}
        />
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