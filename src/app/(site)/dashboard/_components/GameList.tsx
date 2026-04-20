"use client";

import { Typography, Box, ButtonBase, Paper, Skeleton, useTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { GAMES, type GameEntry } from "@/lib/client/registry/games";
import Iconify from "@/components/shared/Iconify";

interface Props {
    isLoading?: boolean;
}

function useGamePalette(color: string) {
    const theme = useTheme();
    return theme.palette[color as keyof typeof theme.palette] as { main: string; contrastText: string };
}

function GameCard({ game, onPlay }: { game: GameEntry; onPlay: (href: string) => void }) {
    const palette = useGamePalette(game.color);

    if (!palette) return null;

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
                bgcolor: palette.main,
                borderRadius: 2,
                width: 140,
                height: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
            }}>
                <Iconify icon={game.icon} sx={{ color: palette.contrastText, fontSize: 50 }} />
                <Typography fontWeight={700} sx={{ color: palette.contrastText }}>{game.label}</Typography>
            </Box>
        </ButtonBase>
    );
}

function GameRow({ game, onPlay }: { game: GameEntry; onPlay: (href: string) => void }) {
    const palette = useGamePalette(game.color);

    if (!palette) return null;

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
                <Box sx={{
                    bgcolor: palette.main,
                    borderRadius: 1.5,
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}>
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

function GameCardSkeleton() {
    return <Skeleton variant="rounded" width={140} height={200} />;
}

function GameRowSkeleton() {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 2, py: 1.5 }}>
            <Skeleton variant="rounded" width={44} height={44} sx={{ flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="60%" />
            </Box>
        </Box>
    );
}

export default function GameList({ isLoading }: Props) {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    function handlePlay(href: string) {
        router.push(href);
    }

    if (isMobile) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {isLoading
                    ? GAMES.map((g) => <GameRowSkeleton key={g.id} />)
                    : GAMES.map((g) => <GameRow key={g.id} game={g} onPlay={handlePlay} />)
                }
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {isLoading
                ? GAMES.map((g) => <GameCardSkeleton key={g.id} />)
                : GAMES.map((g) => <GameCard key={g.id} game={g} onPlay={handlePlay} />)
            }
        </Box>
    );
}