export const SNACKBAR_PRESETS = {
    success: { icon: "mdi:check-bold", severity: "success" },
    error: { icon: "mdi:alert-octagon-outline", severity: "error" },
    info: { icon: "mdi:information-slab-box-outline", severity: "info" },
    warning: { icon: "mdi:alert", severity: "warning" },
    daily: { icon: "mdi:calendar-check-outline", severity: "success" },
    win: { icon: "mdi:party-popper", severity: "success" },
    lose: { icon: "mdi:emoticon-poop-outline", severity: "error" },
    transfer: { icon: "mdi:swap-horizontal", severity: "info" },
} as const;

export type SnackbarPreset = keyof typeof SNACKBAR_PRESETS;