"use client";

import { useEffect, useRef } from "react";

const WAVES = [
    { amplitude: 28, period: 0.0018, speed: 6000,  yBase: 0.30, opacity: 0.4,  color: "#2a2a2a" },
    { amplitude: 38, period: 0.0022, speed: 9000,  yBase: 0.45, opacity: 0.35, color: "#303030" },
    { amplitude: 22, period: 0.0014, speed: 12000, yBase: 0.55, opacity: 0.3,  color: "#262626" },
    { amplitude: 45, period: 0.0010, speed: 15000, yBase: 0.65, opacity: 0.25, color: "#343434" },
    { amplitude: 18, period: 0.0026, speed: 8000,  yBase: 0.75, opacity: 0.18, color: "#202020" },
];

const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

export default function WavyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const lastFrameRef = useRef<number>(0);

    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
            @keyframes waveFadeIn {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const drawWave = (
            ctx: CanvasRenderingContext2D,
            width: number,
            height: number,
            wave: typeof WAVES[number],
            elapsed: number
        ) => {
            const phase = (elapsed / wave.speed) * Math.PI * 2;
            const yBase = height * wave.yBase;
            ctx.beginPath();
            ctx.moveTo(0, height);
            for (let x = 0; x <= width; x += 4) {
                const y = yBase + Math.sin(x * wave.period + phase) * wave.amplitude;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fillStyle = wave.color;
            ctx.globalAlpha = wave.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        };

        const render = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;

            const delta = timestamp - lastFrameRef.current;
            if (delta >= FRAME_INTERVAL) {
                lastFrameRef.current = timestamp - (delta % FRAME_INTERVAL);
                const elapsed = timestamp - startTimeRef.current;
                const { width, height } = canvas;
                ctx.clearRect(0, 0, width, height);
                for (const wave of WAVES) {
                    drawWave(ctx, width, height, wave, elapsed);
                }
            }

            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);
        return () => {
            window.removeEventListener("resize", resize);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0,
                pointerEvents: "none",
                background: "#141414",
                animation: "waveFadeIn 1.2s ease forwards",
            }}
        />
    );
}