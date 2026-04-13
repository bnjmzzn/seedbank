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
        icon: "mdi:trophy",
        href: "/leaderboard" },
    {
        label: "Transfer",
        icon: "mdi:swap-horizontal",
        href: "/transfer" },
    {
        label: "Steal",
        icon: "mdi:scissors-cutting",
        href: "/steal"
    },
];