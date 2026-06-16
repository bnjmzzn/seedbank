export interface NavEntry {
    label: string;
    icon: string;
    href: string;
}

export const NAV_ITEMS: NavEntry[] = [
    {
        label: "Dashboard",
        icon: "mdi:view-dashboard",
        href: "/dashboard"
    },
    {
        label: "Leaderboard",
        icon: "ion:podium",
        href: "/leaderboard" },
    {
        label: "Transfer",
        icon: "mdi:swap-horizontal-bold",
        href: "/transfer" },
    {
        label: "Steal",
        icon: "mdi:safe",
        href: "/steal"
    },
];