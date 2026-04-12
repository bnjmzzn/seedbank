"use client";

import { Typography, Box, ButtonBase, Paper, useTheme, useMediaQuery } from "@mui/material";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import { PlayArrowRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { GAMES, type Game } from "@/lib/client/games";

function GameCard({ game, onPlay }: { game: Game; onPlay: (slug: string) => void }) {
    const theme = useTheme();
    const bg = theme.palette[game.color].main;
    const fg = theme.palette[game.color].contrastText;
    const Icon = game.icon;

    return (
        <ButtonBase
            onClick={() => onPlay(game.slug)}
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
                <Icon sx={{ color: fg, fontSize: 40 }} />
                <Typography fontWeight={700} sx={{ color: fg }}>{game.label}</Typography>
            </Box>
        </ButtonBase>
    );
}

function GameRow({ game, onPlay }: { game: Game; onPlay: (slug: string) => void }) {
    const theme = useTheme();
    const bg = theme.palette[game.color].main;
    const fg = theme.palette[game.color].contrastText;
    const Icon = game.icon;

    return (
        <Paper elevation={1} sx={{ display: "flex", alignItems: "center", borderRadius: 2, overflow: "hidden", height: 72 }}>
            <Box sx={{ bgcolor: bg, height: "100%", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon sx={{ color: fg, fontSize: 28 }} />
            </Box>

            <Typography fontWeight={700} sx={{ flex: 1, px: 2 }}>{game.label}</Typography>

            <ButtonBase onClick={() => onPlay(game.slug)} sx={{ height: "100%", aspectRatio: "1", flexShrink: 0 }}>
                <Box sx={{ bgcolor: theme.palette.primary.main, height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PlayArrowRounded sx={{ color: theme.palette.primary.contrastText, fontSize: 28 }} />
                </Box>
            </ButtonBase>
        </Paper>
    );
}

export default function GameList() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handlePlay = (slug: string) => {
        router.push(`/games/${slug}`);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
                <VideogameAssetIcon color="disabled" />
                <Typography color="text.secondary">Games</Typography>
            </Box>

            {isMobile && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {GAMES.map(game => (
                        <GameRow key={game.id} game={game} onPlay={handlePlay} />
                    ))}
                </Box>
            )}

            {!isMobile && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    {GAMES.map(game => (
                        <GameCard key={game.id} game={game} onPlay={handlePlay} />
                    ))}
                </Box>
            )}
        </Box>
    );
}