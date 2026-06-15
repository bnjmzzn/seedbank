"use client";

import { useState, useEffect } from "react";
import { Snackbar, Alert, Typography, Box, type AlertColor } from "@mui/material";
import { SNACKBAR_PRESETS, type SnackbarPreset } from "@/lib/client/registry/snackbar";
import Iconify from "@/components/shared/generic/Iconify";

interface SnackbarOptions {
    icon?: string;
    severity?: AlertColor;
    duration?: number;
}

interface SnackbarMessage {
    message: string;
    icon: string;
    severity: AlertColor;
    duration?: number;
    key: number;
}

const SNACKBAR_EVENT = "app:snackbar";

interface SnackbarEventDetail {
    message: string;
    preset: SnackbarPreset | SnackbarOptions;
    duration?: number;
}

export function showSnackbar(message: string, preset: SnackbarPreset | SnackbarOptions = "info", duration?: number) {
    const detail: SnackbarEventDetail = { message, preset, duration };
    window.dispatchEvent(new CustomEvent(SNACKBAR_EVENT, { detail }));
}

function resolvePreset(preset: SnackbarPreset | SnackbarOptions): { icon: string; severity: AlertColor } {
    const isPresetKey = typeof preset === "string";
    if (isPresetKey) return SNACKBAR_PRESETS[preset];
    return {
        icon: preset.icon ?? SNACKBAR_PRESETS.info.icon,
        severity: preset.severity ?? "info",
    };
}

export default function SnackBar() {
    const [queue, setQueue] = useState<SnackbarMessage[]>([]);
    const [current, setCurrent] = useState<SnackbarMessage | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        function handleEvent(event: Event) {
            const { message, preset, duration } = (event as CustomEvent<SnackbarEventDetail>).detail;
            const { icon, severity } = resolvePreset(preset);
            setQueue((prev) => [...prev, { message, icon, severity, duration, key: Date.now() }]);
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
            setQueue((prev) => prev.slice(1));
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
                icon={false}
                sx={{
                    width: "100%",
                    bgcolor: `${current?.severity ?? "info"}.main`,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {current?.icon && <Iconify icon={current.icon} width={25} height={25} />}
                    <Typography variant="body1" fontWeight="medium">
                        {current?.message}
                    </Typography>
                </Box>
            </Alert>
        </Snackbar>
    );
}