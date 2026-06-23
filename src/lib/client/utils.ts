import { storage } from "./storage";
import { HistoryRow } from "@/types/db";
import { CURRENCY_TICKER } from "../config";

export function logout() {
    storage.clearAuth();
    window.location.href = "/login";
}

export function getAvatarUrl(username: string): string {
    return `https://api.dicebear.com/10.x/glyphs/svg?seed=${CURRENCY_TICKER}_${username}`;
}

export function filterHistory(rows: HistoryRow[], type?: string): HistoryRow[] {
    if (!type) return rows;
    return rows.filter((row) => row.reason === type || row.reason.startsWith(type + ":"));
}