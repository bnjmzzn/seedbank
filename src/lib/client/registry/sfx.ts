export const SFX_BASE = "/assets/sounds";

export const SFX_IDS = [
    "win/win1",
    "win/win2",
    "win/win3",
    "win/win4",
    "win/win5",
    "win/win6",
    "lose/lose1",
    "lose/lose2",
    "lose/lose3",
    "lose/lose4",
    "lose/lose5",
    "lose/lose6",
    "shared/click",
] as const;

export type SfxId = (typeof SFX_IDS)[number];