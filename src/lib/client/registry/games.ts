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
        id: HistoryReason.Game.CARDS,
        label: "Cards",
        href: "/games/cards",
        icon: "mdi:cards",
        color: "error",
        desc: "Three cards, pick the safest ones.",
    },
    {
        id: HistoryReason.Game.COINFLIP,
        label: "Coin Flip",
        href: "/games/coinflip",
        icon: "mingcute:coin-line",
        color: "warning",
        desc: "Heads or tails, 50/50.",
    },
    {
        id: HistoryReason.Game.COLORS,
        label: "Color Cube",
        href: "/games/colors",
        icon: "mdi:dice",
        color: "secondary",
        desc: "Pick a color, match it on either die.",
    },
    {
        id: HistoryReason.Game.MINES,
        label: "Mines",
        href: "/games/mines",
        icon: "mdi:mine",
        color: "tertiary",
        desc: "Pick four tiles, avoid the bombs.",
    },
    {
        id: HistoryReason.Game.ROULETTE,
        label: "Roulette",
        href: "/games/roulette",
        icon: "pepicons-pop:arrows-spin",
        color: "info",
        desc: "Spin the reel, land on green.",
    },
    {
        id: HistoryReason.Game.SLOTS,
        label: "Slots",
        href: "/games/slots",
        icon: "grommet-icons:multiple",
        color: "primary",
        desc: "Pick a symbol, match two of three reels.",
    },
];