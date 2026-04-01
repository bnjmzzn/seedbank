"use client";

const DOT_POSITIONS: Record<number, { cx: number; cy: number }[]> = {
    1: [{ cx: 50, cy: 50 }],
    2: [{ cx: 25, cy: 25 }, { cx: 75, cy: 75 }],
    3: [{ cx: 25, cy: 25 }, { cx: 50, cy: 50 }, { cx: 75, cy: 75 }],
    4: [{ cx: 25, cy: 25 }, { cx: 75, cy: 25 }, { cx: 25, cy: 75 }, { cx: 75, cy: 75 }],
    5: [{ cx: 25, cy: 25 }, { cx: 75, cy: 25 }, { cx: 50, cy: 50 }, { cx: 25, cy: 75 }, { cx: 75, cy: 75 }],
    6: [{ cx: 25, cy: 20 }, { cx: 75, cy: 20 }, { cx: 25, cy: 50 }, { cx: 75, cy: 50 }, { cx: 25, cy: 80 }, { cx: 75, cy: 80 }],
};

interface Props {
    value: number;
    size?: number;
    className?: string;
}

export default function DiceFace({ value, size = 100, className = "" }: Props) {
    const dots = DOT_POSITIONS[value] ?? [];

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={className}
        >
            <rect
                x="5" y="5" width="90" height="90" rx="18"
                className="fill-card stroke-border"
                strokeWidth="3"
            />
            {dots.map((dot, i) => (
                <circle
                    key={i}
                    cx={dot.cx}
                    cy={dot.cy}
                    r="8"
                    className="fill-foreground"
                />
            ))}
        </svg>
    );
}