import confetti from "canvas-confetti"

export function playWinConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.8 },
    });
}

export function playLoseConfetti() {
    const scalar = 4;
    const emojis = ["🥀", "😭", "🤣", "😂"];
    const shapes = emojis.map((emoji) => confetti.shapeFromText({ text: emoji, scalar }));

    confetti({
        shapes,
        scalar,
        particleCount: 30,
        spread: 180,
        flat: true,
    });
}