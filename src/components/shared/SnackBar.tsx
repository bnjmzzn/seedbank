"use client";

import { useState, useEffect } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface SnackbarMessage {
    message: string;
    severity: AlertColor;
    duration?: number;
    key: number;
}

let snackbarTrigger: (msg: string, sev: AlertColor, dur?: number) => void;

export const showSnackbar = (message: string, severity: AlertColor = "info", duration?: number) => {
    if (snackbarTrigger) {
        snackbarTrigger(message, severity, duration);
    }
};

export default function SnackBar() {
    const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined);

    useEffect(() => {
        snackbarTrigger = (message, severity, duration) => {
            setSnackPack((prev) => [
                ...prev, 
                { message, severity, duration, key: new Date().getTime() }
            ]);
        };
    }, []);

    useEffect(() => {
        if (snackPack.length && !messageInfo) {
            setMessageInfo({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpen(true);
        } else if (snackPack.length && messageInfo && open) {
            setOpen(false);
        }
    }, [snackPack, messageInfo, open]);

    const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const handleExited = () => {
        setMessageInfo(undefined);
    };

    return (
        <Snackbar
            key={messageInfo?.key}
            open={open}
            autoHideDuration={messageInfo?.duration ?? 4000}
            onClose={handleClose}
            TransitionProps={{ onExited: handleExited }}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ my: 2 }}
        >
            <Alert
                onClose={handleClose}
                severity={messageInfo?.severity ?? "info"}
                variant="filled"
                sx={{ 
                    width: "100%",
                }}
            >
                {messageInfo?.message}
            </Alert>
        </Snackbar>
    );
}