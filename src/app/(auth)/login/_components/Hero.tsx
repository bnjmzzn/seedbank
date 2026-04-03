"use client";

import { Box, Typography, Stack } from "@mui/material";
import { useEffect, useState } from "react";

const PHRASES = [
    "SeedBank.",
    "Grow your seeds.",
    "Steal from other players.",
    "Play intense games.",
    "Undefined error obj...",
    "Climb the Leaderboard.",
    "its not gambling bro"
];

export default function Hero() {
    const [displayed, setDisplayed] = useState("");
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = PHRASES[phraseIndex];

        const timeout = setTimeout(() => {
            if (!deleting) {
                setDisplayed(current.slice(0, charIndex + 1));
                if (charIndex + 1 === current.length) {
                    setTimeout(() => setDeleting(true), 5000);
                } else {
                    setCharIndex(c => c + 1);
                }
            } else {
                setDisplayed(current.slice(0, charIndex - 1));
                if (charIndex - 1 === 0) {
                    setDeleting(false);
                    setPhraseIndex(i => (i + 1) % PHRASES.length);
                    setCharIndex(0);
                } else {
                    setCharIndex(c => c - 1);
                }
            }
        }, deleting ? 40 : 80);

        return () => clearTimeout(timeout);
    }, [charIndex, deleting, phraseIndex]);

    return (
        <Stack
            spacing={2}
            sx={{
                flex: 1,
                justifyContent: "center",
                px: 8,
            }}
        >
            <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={2}>
                SeedBank
            </Typography>
            <Typography variant="h3" fontWeight="bold" lineHeight={1.2}>
                {displayed}
                <Box
                    component="span"
                    sx={{
                        display: "inline-block",
                        width: "4px",
                        height: "1em",
                        bgcolor: "primary.main",
                        verticalAlign: "middle",
                        animation: "blink 1s step-end infinite",
                        "@keyframes blink": {
                            "0%, 100%": { opacity: 1 },
                            "50%": { opacity: 0 },
                        },
                    }}
                />
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Claim, play, steal, repeat. It's all just numbers on a database anyway.
            </Typography>
        </Stack>
    );
}