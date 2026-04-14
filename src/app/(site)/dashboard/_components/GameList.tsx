"use client";

import { Typography, Box, ButtonBase, Paper, useTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { GAMES, type GameEntry } from "@/lib/client/registry/games";
import Iconify from "@/components/shared/Iconify";

function GameCard({ game, onPlay }: { game: GameEntry; onPlay: (href: string) => void }) {
    const theme = useTheme();
    const palette = theme.palette[game.color as keyof typeof theme.palette] as { main: string; contrastText: string };
    const bg = palette.main;
    const fg = palette.contrastText;

    return (
        <ButtonBase
            onClick={() => onPlay(game.href)}
            sx={{
                display: "block",
                borderRadius: 2,
                transition: "transform 0.15s ease",
                "&:hover": { transform: "scale(1.04)" },
            }}
        >
            <Box sx={{
                bgcolor: bg,
                borderRadius: 2,
                width: 140,
                height: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
            }}>
                <Iconify icon={game.icon} sx={{ color: fg, fontSize: 50 }} />
                <Typography fontWeight={700} sx={{ color: fg }}>{game.label}</Typography>
            </Box>
        </ButtonBase>
    );
}

function GameRow({ game, onPlay }: { game: GameEntry; onPlay: (href: string) => void }) {
    const theme = useTheme();
    const palette = theme.palette[game.color as keyof typeof theme.palette] as { main: string; contrastText: string };

    return (
        <ButtonBase
            onClick={() => onPlay(game.href)}
            sx={{ display: "block", width: "100%", borderRadius: 2 }}
        >
            <Paper
                elevation={1}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 2,
                    overflow: "hidden",
                    px: 2,
                    py: 1.5,
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        bgcolor: palette.main,
                        borderRadius: 1.5,
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <Iconify icon={game.icon} sx={{ color: palette.contrastText }} />
                </Box>

                <Box sx={{ flex: 1, textAlign: "left" }}>
                    <Typography fontWeight={700}>{game.label}</Typography>
                    <Typography variant="body2" color="text.secondary">{game.desc}</Typography>
                </Box>

                <Iconify icon="mdi:chevron-right" sx={{ color: "text.disabled" }} />
            </Paper>
        </ButtonBase>
    );
}

export default function GameList() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    function handlePlay(href: string) {
        router.push(href);
    }

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                <Iconify icon="mdi:controller" sx={{ color: "text.disabled" }} />
                <Typography color="text.secondary">Games</Typography>
            </Box>

            {isMobile && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {GAMES.map((game) => (
                        <GameRow key={game.id} game={game} onPlay={handlePlay} />
                    ))}
                </Box>
            )}

            {!isMobile && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    {GAMES.map((game) => (
                        <GameCard key={game.id} game={game} onPlay={handlePlay} />
                    ))}
                </Box>
            )}
        </Box>
    );
}