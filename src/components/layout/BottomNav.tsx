"use client";

import { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Avatar, Paper } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/lib/client/nav";
import { useMe } from "@/lib/client/hooks";
import { getAvatarUrl } from "@/lib/client/utils";
import ProfileMenu from "./ProfileMenu";

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const { me } = useMe();

    function handleProfileClick(e: React.MouseEvent<HTMLElement>) {
        setAnchorEl(e.currentTarget);
    }

    function handleMenuClose() {
        setAnchorEl(null);
    }

    return (
        <Paper
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                display: { xs: "block", md: "none" },
                zIndex: (theme) => theme.zIndex.appBar,
            }}
            elevation={0}
        >
            <BottomNavigation
                value={pathname}
                sx={{
                    bgcolor: "background.paper",
                    "& .MuiBottomNavigationAction-root": {
                        minWidth: 0,
                        gap: 0.5,
                    },
                    "& .MuiBottomNavigationAction-label": {
                        color: "transparent",
                    },
                }}
            >
                {navItems.map((item) => (
                    <BottomNavigationAction
                        key={item.href}
                        label={item.label}
                        value={item.href}
                        icon={<item.icon />}
                        onClick={() => router.push(item.href)}
                    />
                ))}
                <BottomNavigationAction
                    label={me?.username ?? "—"}
                    value="/profile"
                    icon={
                        <Avatar
                            src={me ? getAvatarUrl(me.username) : undefined}
                            sx={{ width: 24, height: 24 }}
                        />
                    }
                    onClick={handleProfileClick}
                />
            </BottomNavigation>

            <ProfileMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                username={me?.username ?? ""}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
                transformOrigin={{ horizontal: "center", vertical: "bottom" }}
            />
        </Paper>
    );
}