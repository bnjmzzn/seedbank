"use client";

import { useEffect, useState } from "react";

export const COLORS = [
    { id: "red",    label: "Red",    hex: "#ef4444" },
    { id: "blue",   label: "Blue",   hex: "#3b82f6" },
    { id: "green",  label: "Green",  hex: "#22c55e" },
    { id: "yellow", label: "Yellow", hex: "#eab308" },
    { id: "purple", label: "Purple", hex: "#a855f7" },
    { id: "orange", label: "Orange", hex: "#f97316" },
] as const;

export type ColorId = typeof COLORS[number]["id"];

const FACE_TRANSFORMS: Record<string, string> = {
    red:    "rotateY(0deg) translateZ(60px)",
    blue:   "rotateY(180deg) translateZ(60px)",
    green:  "rotateY(90deg) translateZ(60px)",
    yellow: "rotateY(-90deg) translateZ(60px)",
    purple: "rotateX(-90deg) translateZ(60px)",
    orange: "rotateX(90deg) translateZ(60px)",
};

const FACE_ROTATIONS: Record<string, string> = {
    red:    "rotateX(0deg) rotateY(0deg)",
    blue:   "rotateX(0deg) rotateY(180deg)",
    green:  "rotateX(0deg) rotateY(-90deg)",
    yellow: "rotateX(0deg) rotateY(90deg)",
    purple: "rotateX(90deg) rotateY(0deg)",
    orange: "rotateX(-90deg) rotateY(0deg)",
};

interface Props {
    result: ColorId | null;
    rolling: boolean;
}

export default function ColorCube({ result, rolling }: Props) {
    const [rotation, setRotation] = useState("rotateX(0deg) rotateY(0deg)");
    const [isSettling, setIsSettling] = useState(false);

    useEffect(() => {
        if (rolling) {
            setIsSettling(false);
            let ticks = 0;
            const interval = setInterval(() => {
                ticks++;
                const rx = Math.floor(Math.random() * 4) * 90 + (ticks * 37);
                const ry = Math.floor(Math.random() * 4) * 90 + (ticks * 53);
                setRotation(`rotateX(${rx}deg) rotateY(${ry}deg)`);
            }, 120);
            return () => clearInterval(interval);
        }

        if (result) {
            setIsSettling(true);
            const target = FACE_ROTATIONS[result];
            const rx = target.match(/rotateX\(([^)]+)\)/)?.[1] ?? "0deg";
            const ry = target.match(/rotateY\(([^)]+)\)/)?.[1] ?? "0deg";
            setRotation(`rotateX(${rx}) rotateY(${ry})`);
        }
    }, [rolling, result]);

    return (
        <div className="flex justify-center items-center" style={{ height: 160 }}>
            <div style={{ perspective: "600px" }}>
                <div
                    style={{
                        width: 120,
                        height: 120,
                        position: "relative",
                        transformStyle: "preserve-3d",
                        transform: rotation,
                        transition: isSettling ? "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "transform 0.1s linear",
                    }}
                >
                    {COLORS.map((color) => (
                        <div
                            key={color.id}
                            style={{
                                position: "absolute",
                                width: 120,
                                height: 120,
                                borderRadius: 16,
                                backgroundColor: color.hex,
                                transform: FACE_TRANSFORMS[color.id],
                                backfaceVisibility: "hidden",
                                opacity: 0.92,
                                border: "3px solid rgba(255,255,255,0.15)",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}