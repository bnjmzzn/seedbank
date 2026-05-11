import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration = 1000, enabled = true) {
    const [display, setDisplay] = useState(target);
    const prev = useRef(target);
    const raf = useRef<number | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const from = prev.current;
        const to = target;
        const diff = to - from;

        if (diff === 0) return;

        const start = performance.now();

        const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setDisplay(Math.round(from + diff * eased));

            if (progress < 1) {
                raf.current = requestAnimationFrame(tick);
            } else {
                prev.current = to;
            }
        };

        raf.current = requestAnimationFrame(tick);

        return () => {
            if (raf.current !== null) cancelAnimationFrame(raf.current);
        };
    }, [target, duration, enabled]);

    return display;
}