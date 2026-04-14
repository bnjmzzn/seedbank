import { storage } from "./storage";
import { HistoryRow } from "@/types/db";

export function logout() {
    storage.clearAuth();
    window.location.href = "/login";
}

export function getAvatarUrl(username: string | null): string {
    return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=seedbank_${username}`;
}

export function filterHistory(rows: HistoryRow[], type?: string): HistoryRow[] {
    if (!type) return rows;
    return rows.filter((row) => row.reason === type || row.reason.startsWith(type + ":"));
}