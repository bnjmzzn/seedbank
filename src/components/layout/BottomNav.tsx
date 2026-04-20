"use client";

import { Box, Avatar, Paper, ButtonBase } from "@mui/material";
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
                display: { xs: "flex", md: "none" },
                zIndex: (theme) => theme.zIndex.appBar,
            }}
            elevation={0}
        >
            <Box sx={{ display: "flex", width: "100%", height: 64 }}>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <ButtonBase
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                color: isActive ? "primary.main" : "text.disabled",
                                transition: "color 0.3s ease",
                            }}
                        >
                            <Iconify
                                icon={item.icon}
                                sx={{
                                    fontSize: 24,
                                    transform: isActive ? "translateY(-4px)" : "translateY(0)",
                                    transition: "transform 0.3s ease",
                                }}
                            />
                            {isActive && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        width: "100%",
                                        height: 4,
                                        bgcolor: "primary.main",
                                    }}
                                />
                            )}
                        </ButtonBase>
                    );
                })}

                <ButtonBase
                    onClick={open}
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Avatar
                        src={me ? getAvatarUrl(me.username) : undefined}
                        sx={{ width: 24, height: 24 }}
                    />
                </ButtonBase>
            </Box>

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