import { HistoryReason } from "@/types/models";
import { GAMES } from "./games";

export interface HistoryEntry {
    label: string;
    icon: string;
    color: string;
}

const gameEntries = Object.fromEntries(
    GAMES.map(({ id, label, icon, color }) => [id, { label, icon, color }])
);

export const HISTORY_META: Record<string, HistoryEntry> = {
    ...gameEntries, // add games reason here
    [HistoryReason.DAILY]: {
        label: "Daily Reward",
        icon: "mdi:calendar-star",
        color: "primary",
    },
    [HistoryReason.Transfer.SENT]: {
        label: "Transfer Sent",
        icon: "mdi:arrow-top-right",
        color: "error",
    },
    [HistoryReason.Transfer.RECEIVED]: {
        label: "Transfer Received",
        icon: "mdi:arrow-bottom-left",
        color: "success",
    },
    [HistoryReason.Steal.ROBBER]: {
        label: "Stole from",
        icon: "mdi:robber",
        color: "success",
    },
    [HistoryReason.Steal.VICTIM]: {
        label: "Stolen by",
        icon: "mdi:knife",
        color: "error",
    },
};