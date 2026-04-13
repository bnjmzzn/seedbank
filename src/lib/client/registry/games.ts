import { HistoryReason } from "@/types/models";

export interface GameEntry {
    id: HistoryReason.Game;
    label: string;
    href: string;
    icon: string;
    color: string;
    desc: string;
}

export const GAMES: GameEntry[] = [
    {
        id: HistoryReason.Game.COINFLIP,
        label: "Coin Flip",
        href: "/games/coinflip",
        icon: "mdi:coin",
        color: "warning",
        desc: "Heads or tails, 50/50.",
    },
    {
        id: HistoryReason.Game.DICE,
        label: "Dice",
        href: "/games/dice",
        icon: "mdi:dice-multiple",
        color: "error",
        desc: "Roll your luck.",
    },
    {
        id: HistoryReason.Game.COLOR,
        label: "Color",
        href: "/games/color",
        icon: "mdi:palette",
        color: "secondary",
        desc: "Pick a color, take a chance.",
    },
    {
        id: HistoryReason.Game.BOMB,
        label: "Bomb",
        href: "/games/bomb",
        icon: "mdi:bomb",
        color: "success",
        desc: "Don't blow it.",
    },
    {
        id: HistoryReason.Game.RACE,
        label: "Race",
        href: "/games/race",
        icon: "mdi:flag-checkered",
        color: "info",
        desc: "Back your winner.",
    },
];