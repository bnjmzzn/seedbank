"use client";

import { useRouter } from "next/navigation";
import { Box, Avatar, Typography, ButtonBase } from "@mui/material";
import { usePathname } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import { getAvatarUrl } from "@/lib/client/avatar";

export default function ProfileCard() {
    const router = useRouter();
    const pathname = usePathname();
    const { username } = useUserStore();
    const selected = pathname === `/users/${username}`;

    return (
        <ButtonBase
            onClick={() => router.push(`/users/${username}`)}
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1,
                px: 1,
                py: 1.5,
                borderRadius: 2,
                color: selected ? "primary.main" : "text.secondary",
                bgcolor: selected ? "action.selected" : "transparent",
                "&:hover": {
                    bgcolor: "action.hover",
                    color: "text.primary",
                },
                transition: "all 0.15s ease",
            }}
        >
            <Avatar
                sx={{ width: 30, height: 30, flexShrink: 0 }}
                src={username ? getAvatarUrl(username) : undefined}
            />
            <Typography variant="body2" fontWeight={selected ? 600 : 500} noWrap sx={{ opacity: username ? 1 : 0.4 }}>
                {username ? `@${username}` : "loading..."}
            </Typography>
        </ButtonBase>
    );
}