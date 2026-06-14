import { Howl } from "howler";

const BASE = "/assets/sounds";
const ids = [
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

type SfxId = (typeof ids)[number];

const SFX = Object.fromEntries(
    ids.map((id) => [id, new Howl({ src: [`${BASE}/${id}.mp3`] })])
) as Record<SfxId, Howl>;

function isSfxId(id: string): id is SfxId {
    return (ids as readonly string[]).includes(id);
}

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

export function playSfx(id: SfxId): void {
    if (!isSfxId(id)) return;
    SFX[id]?.play();
}