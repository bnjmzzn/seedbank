import { TollRounded, CasinoRounded, ColorLensRounded, WhatshotRounded, SportsScoreRounded } from "@mui/icons-material";
import type { SvgIconComponent } from "@mui/icons-material";

export interface Game {
    id: string;
    label: string;
    slug: string;
    icon: SvgIconComponent;
    color: "warning" | "error" | "secondary" | "success" | "info";
    tagline: string;
}

export const GAMES: Game[] = [
    { id: "GAME:COINFLIP", label: "Coin Flip", slug: "coinflip", icon: TollRounded,       color: "warning",   tagline: "Heads or tails, 50/50." },
    { id: "GAME:DICE",     label: "Dice",      slug: "dice",     icon: CasinoRounded,      color: "error",     tagline: "Roll your luck." },
    { id: "GAME:COLOR",    label: "Color",     slug: "color",    icon: ColorLensRounded,   color: "secondary", tagline: "Pick a color, take a chance." },
    { id: "GAME:BOMB",     label: "Bomb",      slug: "bomb",     icon: WhatshotRounded,    color: "success",   tagline: "Don't blow it." },
    { id: "GAME:RACE",     label: "Race",      slug: "race",     icon: SportsScoreRounded, color: "info",      tagline: "Back your winner." },
];