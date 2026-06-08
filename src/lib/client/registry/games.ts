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
        id: HistoryReason.Game.COLOR,
        label: "Color",
        href: "/games/color",
        icon: "mdi:palette",
        color: "secondary",
        desc: "Pick a color, roll two dice.",
    },
    {
        id: HistoryReason.Game.BOMB,
        label: "Bomb",
        href: "/games/bomb",
        icon: "mdi:bomb",
        color: "error",
        desc: "Pick a card, avoid the bomb.",
    },
    {
        id: HistoryReason.Game.SLOTS,
        label: "Slots",
        href: "/games/slots",
        icon: "mdi:slot-machine",
        color: "success",
        desc: "Spin three reels, match two.",
    },
    {
        id: HistoryReason.Game.VAULT,
        label: "Vault",
        href: "/games/vault",
        icon: "mdi:safe",
        color: "info",
        desc: "Pick four digits, guess the code.",
    },
];