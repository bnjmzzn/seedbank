"use client";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/client/utils";

interface ProfileMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    username: string;
}

export default function ProfileMenu({ anchorEl, open, onClose, username }: ProfileMenuProps) {
    const router = useRouter();

    function handleProfile() {
        router.push(`/users/${username}`);
        onClose();
    }

    function handleReferral() {
        router.push("/referral");
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
            transformOrigin={{ horizontal: "left", vertical: "bottom" }}
            anchorOrigin={{ horizontal: "left", vertical: "top" }}
            elevation={0}
            slotProps={{
                paper: {
                    sx: { minWidth: 180 },
                },
            }}
        >
            <MenuItem onClick={handleProfile}>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                <ListItemText>View profile</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: "error.main" }} /></ListItemIcon>
                <ListItemText>Logout</ListItemText>
            </MenuItem>
        </Menu>
    );
}