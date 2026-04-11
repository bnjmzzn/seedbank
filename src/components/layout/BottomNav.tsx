"use client";

import { useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/lib/client/nav";
import ProfileMenu from "./ProfileMenu";

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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
                    label="Profile"
                    value="/profile"
                    icon={
                        <Avatar
                            src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=seedbank_placeholder"
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
                username="placeholder"
            />
        </Paper>
    );
}