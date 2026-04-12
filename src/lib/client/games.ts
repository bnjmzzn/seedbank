import { TollRounded, CasinoRounded, ColorLensRounded, WhatshotRounded, SportsScoreRounded } from "@mui/icons-material";
import type { SvgIconComponent } from "@mui/icons-material";
import { HistoryReason } from "@/types/database";

export interface Game {
    id: HistoryReason.Game;
    label: string;
    slug: string;
    icon: SvgIconComponent;
    color: "warning" | "error" | "secondary" | "success" | "info";
    tagline: string;
}

export const GAMES: Game[] = [
    {
        id: HistoryReason.Game.COINFLIP,
        label: "Coin Flip",
        slug: "coinflip",
        icon: TollRounded,
        color: "warning",
        tagline: "Heads or tails, 50/50.",
    },
    {
        id: HistoryReason.Game.DICE,
        label: "Dice",
        slug: "dice",
        icon: CasinoRounded,
        color: "error",
        tagline: "Roll your luck.",
    },
    {
        id: HistoryReason.Game.COLOR,
        label: "Color",
        slug: "color",
        icon: ColorLensRounded,
        color: "secondary",
        tagline: "Pick a color, take a chance.",
    },
    {
        id: HistoryReason.Game.BOMB,
        label: "Bomb",
        slug: "bomb",
        icon: WhatshotRounded,
        color: "success",
        tagline: "Don't blow it.",
    },
    {
        id: HistoryReason.Game.RACE,
        label: "Race",
        slug: "race",
        icon: SportsScoreRounded,
        color: "info",
        tagline: "Back your winner.",
    },
];