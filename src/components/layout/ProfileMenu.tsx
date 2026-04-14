"use client";

import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import type { PopoverOrigin } from "@mui/material";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/client/utils";
import Iconify from "../shared/Iconify";

interface ProfileMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    username: string;
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
}

export default function ProfileMenu({
    anchorEl,
    open,
    onClose,
    username,
    anchorOrigin = { horizontal: "left", vertical: "top" },
    transformOrigin = { horizontal: "left", vertical: "bottom" },
}: ProfileMenuProps) {
    const router = useRouter();

    function handleProfile() {
        router.push(`/users/${username}`);
        onClose();
    }

    function handleLogout() {
        onClose();
        logout();
    }

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            elevation={0}
            slotProps={{
                list: {
                    sx: { p: 1 },
                },
                paper: {
                    sx: {
                        minWidth: 180,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                    },
                },
            }}
        >
            <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                    <Iconify icon="mdi:account" />
                </ListItemIcon>
                <ListItemText>View profile</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={handleLogout}
                sx={{
                    color: "error.main",
                    "&:hover": {
                        backgroundColor: "error.dark",
                    }
                }}>
                <ListItemIcon>
                    <Iconify icon="mdi:logout" sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
            </MenuItem>
        </Menu>
    );
}