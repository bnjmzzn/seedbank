import { Howl } from "howler";
import { SFX_BASE, SFX_IDS, type SfxId } from "@/lib/client/registry/sfx";

const SFX = Object.fromEntries(
    SFX_IDS.map((id) => [id, new Howl({ src: [`${SFX_BASE}/${id}.mp3`] })])
) as Record<SfxId, Howl>;

function isSfxId(id: string): id is SfxId {
    return (SFX_IDS as readonly string[]).includes(id);
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