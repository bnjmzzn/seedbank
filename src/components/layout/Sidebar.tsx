"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/lib/client/nav";
import ProfileMenu from "./ProfileMenu";

const DRAWER_WIDTH = 240;

export default function Sidebar() {
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
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                display: { xs: "none", md: "flex" },
                "& .MuiDrawer-paper": {
                    width: DRAWER_WIDTH,
                    boxSizing: "border-box",
                    border: "none",
                    display: "flex",
                    flexDirection: "column",
                    px: 2,
                    py: 3,
                },
            }}
        >
            <Typography variant="h6" fontWeight={700} sx={{ px: 1, mb: 3 }}>
                Seedbank
            </Typography>

            <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {navItems.map((item) => (
                    <ListItemButton
                        key={item.href}
                        selected={pathname === item.href}
                        onClick={() => router.push(item.href)}
                        sx={{ borderRadius: 1, py: 1.5 }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <item.icon />
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Divider sx={{ mb: 2 }} />

            <Box
                onClick={handleProfileClick}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1,
                    py: 1.5,
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                }}
            >
                <Avatar
                    src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=seedbank_placeholder"
                    sx={{ width: 32, height: 32 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                        placeholder
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        1,000 seeds
                    </Typography>
                </Box>
            </Box>

            <ProfileMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                username="placeholder"
            />
        </Drawer>
    );
}