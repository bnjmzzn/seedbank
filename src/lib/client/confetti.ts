import confetti from "canvas-confetti";

function makeConfettiInstance() {
    const canvas = document.createElement("canvas");

    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";

    document.body.appendChild(canvas);

    const instance = confetti.create(canvas, { resize: true, useWorker: true });

    return { instance, canvas };
}

export function playWinConfetti() {
    const { instance, canvas } = makeConfettiInstance();

    instance({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.8 },
    });

    setTimeout(() => canvas.remove(), 5000);
}

export function playLoseConfetti() {
    const { instance, canvas } = makeConfettiInstance();

    const scalar = 4;
    const emojis = ["🥀", "😭", "🤣", "😂"];
    const shapes = emojis.map((emoji) => confetti.shapeFromText({ text: emoji, scalar }));

    instance({
        shapes,
        scalar,
        particleCount: 30,
        spread: 180,
        flat: true,
    });

    setTimeout(() => canvas.remove(), 5000);
}