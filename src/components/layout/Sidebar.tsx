"use client";

import { useState } from "react";
import {
    Box,
    ButtonBase,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Typography,
    Divider,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/lib/client/nav";
import { useMe } from "@/lib/client/hooks";
import { getAvatarUrl } from "@/lib/client/utils";
import ProfileMenu from "./ProfileMenu";
import Brand from "@/components/shared/Brand";

export default function Sidebar() {
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
        <Drawer
            variant="permanent"
            sx={{
                width: 280,
                flexShrink: 0,
                display: { xs: "none", md: "flex" },
                "& .MuiDrawer-paper": {
                    width: 280,
                    boxSizing: "border-box",
                    border: "none",
                    display: "flex",
                    flexDirection: "column",
                    px: 2,
                    py: 3,
                },
            }}
        >
            <Brand sx={{ px: 1, mb: 3 }} />

            <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <ListItemButton
                            key={item.href}
                            selected={active}
                            onClick={() => router.push(item.href)}
                            sx={{
                                py: 1.5,
                                "&.Mui-selected": {
                                    bgcolor: "primary.dark",
                                    color: "primary.main",
                                    "&:hover": {
                                        bgcolor: "primary.dark",
                                    },
                                    "& .MuiListItemIcon-root": {
                                        color: "primary.main",
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <item.icon />
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    );
                })}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Divider sx={{ mb: 2 }} />

            <ButtonBase
                onClick={handleProfileClick}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1,
                    py: 1.5,
                    borderRadius: 1,
                    textAlign: "left",
                    "&:hover": { bgcolor: "action.hover" },
                }}
            >
                <Avatar
                    src={me ? getAvatarUrl(me.username) : undefined}
                    sx={{ width: 32, height: 32 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography>
                        {me?.username ?? "—"}
                    </Typography>
                    <Typography color="text.secondary">
                        {me ? `${me.balance.toLocaleString()} seeds` : "—"}
                    </Typography>
                </Box>
            </ButtonBase>

            <ProfileMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                username={me?.username ?? ""}
            />
        </Drawer>
    );
}