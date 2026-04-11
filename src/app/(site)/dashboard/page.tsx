"use client";

import { Box, Typography } from "@mui/material";

const GAMES = [
    { id: "GAME:COINFLIP", label: "Coin Flip", slug: "coinflip" },
    { id: "GAME:DICE", label: "Dice", slug: "dice" },
    { id: "GAME:COLOR", label: "Color", slug: "color" },
    { id: "GAME:BOMB", label: "Bomb", slug: "bomb" },
    { id: "GAME:RACE", label: "Race", slug: "race" },
];

export default function DashboardPage() {
    return (
        <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1, minWidth: 0, overflow: "hidden" }}>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Box sx={{ flex: 1, minWidth: 200, height: 160, bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body2" color="text.secondary">Balance card</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 200, height: 160, bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body2" color="text.secondary">Daily claim</Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    overflowX: "scroll",
                    scrollSnapType: "x mandatory",
                    touchAction: "pan-x",
                    "&::-webkit-scrollbar": { display: "none" },
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                }}
            >
                {GAMES.map((game) => (
                    <Box
                        key={game.id}
                        sx={{
                            flexShrink: 0,
                            width: 120,
                            aspectRatio: "3/4",
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            overflow: "hidden",
                            cursor: "pointer",
                            scrollSnapAlign: "start",
                            display: "flex",
                            alignItems: "flex-end",
                            "&:hover": { borderColor: "primary.main" },
                        }}
                    >
                        <Box sx={{ p: 1, width: "100%" }}>
                            <Typography variant="body2" fontWeight={500}>{game.label}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Box sx={{ height: 280, bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="body2" color="text.secondary">Transaction feed</Typography>
            </Box>

        </Box>
    );
}