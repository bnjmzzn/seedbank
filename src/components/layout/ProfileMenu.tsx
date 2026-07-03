"use client";

import { useState } from "react";
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Button,
} from "@mui/material";
import type { PopoverOrigin } from "@mui/material";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/client/utils";
import Iconify from "../shared/generic/Iconify";

interface ProfileMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    username: string;
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
}

export function useProfileMenu() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    function open(e: React.MouseEvent<HTMLElement>) {
        setAnchorEl(e.currentTarget);
    }

    function close() {
        setAnchorEl(null);
    }

    return { anchorEl, open, close, isOpen: Boolean(anchorEl) };
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
    const [confirmOpen, setConfirmOpen] = useState(false);

    function handleProfile() {
        router.push(`/users/${username}`);
        onClose();
    }

    function handleLogoutClick() {
        onClose();
        setConfirmOpen(true);
    }

    function handleConfirmClose() {
        setConfirmOpen(false);
    }

    function handleConfirmLogout() {
        setConfirmOpen(false);
        logout();
    }

    return (
        <>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={onClose}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
                elevation={0}
                slotProps={{
                    list: { sx: { p: 1 } },
                    paper: {
                        sx: {
                            width: 248,
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
                    onClick={handleLogoutClick}
                    sx={{
                        color: "error.main",
                        "&:hover": { backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08) }
                    }}
                >
                    <ListItemIcon>
                        <Iconify icon="mdi:logout" sx={{ color: "error.main" }} />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>

            <Dialog
                open={confirmOpen}
                onClose={handleConfirmClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            width: 320,
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                        },
                    },
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>Log out</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to log out of your account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button onClick={handleConfirmClose} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmLogout} color="error" variant="contained">
                        Log out
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}