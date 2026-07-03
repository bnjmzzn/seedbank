import { useEffect, useRef, useState, useCallback } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

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

export function useInvisibleCaptcha() {
    const captchaRef = useRef<HCaptcha>(null);
    const resolveRef = useRef<((token: string) => void) | null>(null);
    const rejectRef = useRef<((reason: Error) => void) | null>(null);

    const requestToken = useCallback(() => {
        return new Promise<string>((resolve, reject) => {
            resolveRef.current = resolve;
            rejectRef.current = reject;
            captchaRef.current?.execute();
        });
    }, []);

    const handleVerify = useCallback((token: string) => {
        resolveRef.current?.(token);
        resolveRef.current = null;
        rejectRef.current = null;
    }, []);

    const handleError = useCallback(() => {
        rejectRef.current?.(new Error("CAPTCHA_FAILED"));
        resolveRef.current = null;
        rejectRef.current = null;
    }, []);

    const resetCaptcha = useCallback(() => {
        captchaRef.current?.resetCaptcha();
    }, []);

    return { captchaRef, requestToken, handleVerify, handleError, resetCaptcha };
}