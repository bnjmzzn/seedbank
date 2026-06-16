export const SNACKBAR_PRESETS = {
    success: { icon: "formkit:check", severity: "success" },
    error: { icon: "icon-park-solid:error", severity: "error" },
    info: { icon: "fa:info", severity: "info" },
    warning: { icon: "ri:alert-line", severity: "warning" },
    enter: { icon: "iconamoon:enter-bold", severity: "success" },
    daily: { icon: "mdi:calendar-check-outline", severity: "success" },
    win: { icon: "streamline:party-popper", severity: "success" },
    lose: { icon: "la:poop", severity: "error" },
    transfer: { icon: "mdi:swap-horizontal-bold", severity: "info" },
} as const;

export type SnackbarPreset = keyof typeof SNACKBAR_PRESETS;