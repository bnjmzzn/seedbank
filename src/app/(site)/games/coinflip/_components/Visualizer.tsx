"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { animate } from "animejs";

interface GameResult {
    won: boolean;
    delta: number;
    balance: number;
}

interface Props {
    result: GameResult | null;
    choice: "heads" | "tails" | null;
    onFinish: () => void;
}

export default function Visualizer({ result, choice, onFinish }: Props) {
    const coinRef = useRef<HTMLDivElement>(null);
    const rotationRef = useRef(0);
    const [display, setDisplay] = useState<GameResult | null>(null);
    const [face, setFace] = useState<"heads" | "tails">("heads");

    useEffect(() => {
        if (result === null || choice === null) return;

        const from = rotationRef.current;
        const spins = 1800;
        const landingOffset = result.won ? 0 : 180;
        const to = Math.ceil(from / 360) * 360 + spins + landingOffset;

        setDisplay(null);
        setFace(choice);

        animate(coinRef.current, {
            rotateY: [from, to],
            duration: 1800,
            easing: "easeOutQuart",
            complete: () => {
                rotationRef.current = to;
                setFace(result.won ? choice : choice === "heads" ? "tails" : "heads");
                setDisplay(result);
                setTimeout(onFinish, 1000);
            },
        });
    }, [result]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                minHeight: 260,
            }}
        >
            <Box sx={{ perspective: "600px" }}>
                <Box
                    ref={coinRef}
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backfaceVisibility: "visible",
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" color="primary.contrastText">
                        {face === "heads" ? "H" : "T"}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}