"use client";

import { useState, useEffect } from "react";
import { Snackbar, Alert, type AlertColor } from "@mui/material";

interface SnackbarMessage {
    message: string;
    severity: AlertColor;
    duration?: number;
    key: number;
}

const SNACKBAR_EVENT = "app:snackbar";

interface SnackbarEventDetail {
    message: string;
    severity: AlertColor;
    duration?: number;
}

export function showSnackbar(message: string, severity: AlertColor = "info", duration?: number) {
    const detail: SnackbarEventDetail = { message, severity, duration };
    window.dispatchEvent(new CustomEvent(SNACKBAR_EVENT, { detail }));
}

export default function SnackBar() {
    const [queue, setQueue] = useState<SnackbarMessage[]>([]);
    const [current, setCurrent] = useState<SnackbarMessage | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        function handleEvent(e: Event) {
            const { message, severity, duration } = (e as CustomEvent<SnackbarEventDetail>).detail;
            setQueue(prev => [...prev, { message, severity, duration, key: Date.now() }]);
        }

        window.addEventListener(SNACKBAR_EVENT, handleEvent);
        return () => window.removeEventListener(SNACKBAR_EVENT, handleEvent);
    }, []);

    useEffect(() => {
        const hasNext = queue.length > 0;
        const isIdle = !current;
        const isVisible = open;

        if (hasNext && isIdle) {
            setCurrent(queue[0]);
            setQueue(prev => prev.slice(1));
            setOpen(true);
            return;
        }

        if (hasNext && isVisible) {
            setOpen(false);
        }
    }, [queue, current, open]);

    function handleClose(_?: React.SyntheticEvent | Event, reason?: string) {
        if (reason === "clickaway") return;
        setOpen(false);
    }

    function handleExited() {
        setCurrent(null);
    }

    return (
        <Snackbar
            key={current?.key}
            open={open}
            autoHideDuration={current?.duration ?? 4000}
            onClose={handleClose}
            slotProps={{ transition: { onExited: handleExited } }}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ my: 2 }}
        >
            <Alert
                onClose={handleClose}
                severity={current?.severity ?? "info"}
                variant="filled"
                sx={{ width: "100%" }}
            >
                {current?.message}
            </Alert>
        </Snackbar>
    );
}