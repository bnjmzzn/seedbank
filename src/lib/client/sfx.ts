import { Howl } from "howler";

const BASE = "/assets/sounds";

const SFX: Record<string, Howl> = {
    "win/win1": new Howl({ src: [`${BASE}/win/win1.mp3`] }),
    "win/win2": new Howl({ src: [`${BASE}/win/win2.mp3`] }),
    "win/win3": new Howl({ src: [`${BASE}/win/win3.mp3`] }),
    "win/win4": new Howl({ src: [`${BASE}/win/win4.mp3`] }),
    "win/win5": new Howl({ src: [`${BASE}/win/win5.mp3`] }),
    "lose/lose1": new Howl({ src: [`${BASE}/lose/lose1.mp3`] }),
    "lose/lose2": new Howl({ src: [`${BASE}/lose/lose2.mp3`] }),
    "lose/lose3": new Howl({ src: [`${BASE}/lose/lose3.mp3`] }),
    "lose/lose4": new Howl({ src: [`${BASE}/lose/lose4.mp3`] }),
    "lose/lose5": new Howl({ src: [`${BASE}/lose/lose5.mp3`] }),
    "lose/lose6": new Howl({ src: [`${BASE}/lose/lose6.mp3`] }),
    "shared/click": new Howl({ src: [`${BASE}/shared/click.mp3`] }),
};

function pickRandom(prefix: string): Howl {
    const matches = Object.entries(SFX)
        .filter(([key]) => key.startsWith(prefix))
        .map(([, howl]) => howl);

    const index = Math.floor(Math.random() * matches.length);
    return matches[index];
}

export function playRandomSfxByPrefix(prefix: string): void {
    pickRandom(prefix)?.play();
}

export function playSfx(id: string): void {
    SFX[id]?.play();
}