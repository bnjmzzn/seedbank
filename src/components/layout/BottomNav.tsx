"use client";

import { BottomNavigation, BottomNavigationAction, Avatar, Paper } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/lib/client/registry/nav";
import Iconify from "@/components/shared/Iconify";
import { useMe } from "@/lib/client/hooks";
import { getAvatarUrl } from "@/lib/client/utils";
import ProfileMenu, { useProfileMenu } from "./ProfileMenu";

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { me } = useMe();
    const { anchorEl, open, close, isOpen } = useProfileMenu();

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
                {NAV_ITEMS.map((item) => (
                    <BottomNavigationAction
                        key={item.href}
                        label={item.label}
                        value={item.href}
                        icon={<Iconify icon={item.icon} />}
                        onClick={() => router.push(item.href)}
                    />
                ))}
                <BottomNavigationAction
                    label={me?.username ?? "—"}
                    icon={
                        <Avatar
                            src={me ? getAvatarUrl(me.username) : undefined}
                            sx={{ width: 24, height: 24 }}
                        />
                    }
                    onClick={open}
                />
            </BottomNavigation>

            <ProfileMenu
                anchorEl={anchorEl}
                open={isOpen}
                onClose={close}
                username={me?.username ?? ""}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
                transformOrigin={{ horizontal: "center", vertical: "bottom" }}
            />
        </Paper>
    );
}