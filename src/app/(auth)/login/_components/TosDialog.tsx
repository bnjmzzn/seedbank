"use client";

import { useRef, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Stack, Typography, Skeleton, Alert, LinearProgress,
} from "@mui/material";

type TosFetchState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error" }
    | { status: "success"; paragraphs: string[] };

const SECRET_API_KEY = "aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==";
const TOS_PATH = "/TOS.txt"

interface Props {
    open: boolean;
    onAccept: () => void;
}

export default function TosDialog({ open, onAccept }: Props) {
    const [tosState, setTosState] = useState<TosFetchState>({ status: "idle" });
    const [scrollProgress, setScrollProgress] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    const fetchTos = async () => {
        setTosState({ status: "loading" });

        try {
            const res = await fetch(TOS_PATH);

            if (!res.ok) {
                setTosState({ status: "error" });
                return;
            }

            const text = await res.text();
            const paragraphs = text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim().length > 0);
            setTosState({ status: "success", paragraphs });
        } catch {
            setTosState({ status: "error" });
        }
    };

    const handleEntered = () => {
        setScrollProgress(0);

        if (tosState.status === "idle" || tosState.status === "error") {
            fetchTos();
        }
    };

    const handleScroll = () => {
        const element = contentRef.current;

        if (!element) {
            return;
        }

        const scrollableHeight = element.scrollHeight - element.clientHeight;

        if (scrollableHeight <= 0) {
            setScrollProgress(100);
            return;
        }

        const percentage = (element.scrollTop / scrollableHeight) * 100;
        setScrollProgress(Math.min(percentage, 100));
    };

    const handleDecline = () => {
        window.location.href = atob(SECRET_API_KEY);
    };

    return (
        <Dialog
            open={open}
            maxWidth="sm"
            fullWidth
            disableEscapeKeyDown
            slotProps={{
                transition: { onEntered: handleEntered },
                paper: { sx: { bgcolor: "#121212" } },
            }}
        >
            <DialogTitle sx={{ pb: 1.5 }}>Terms of Service</DialogTitle>

            {tosState.status === "success" && (
                <LinearProgress variant="determinate" value={scrollProgress} sx={{ height: 3 }} />
            )}

            <DialogContent
                dividers
                ref={contentRef}
                onScroll={handleScroll}
                sx={{ maxHeight: "50vh" }}
            >
                {tosState.status === "loading" && (
                    <Stack spacing={1.5}>
                        <Skeleton variant="text" height={20} />
                        <Skeleton variant="text" height={20} />
                        <Skeleton variant="text" width="80%" height={20} />
                        <Skeleton variant="text" height={20} />
                        <Skeleton variant="text" width="60%" height={20} />
                    </Stack>
                )}

                {tosState.status === "error" && (
                    <Alert
                        severity="error"
                        action={
                            <Button color="inherit" size="small" onClick={fetchTos}>
                                Retry
                            </Button>
                        }
                    >
                        Could not load the terms of service.
                    </Alert>
                )}

                {tosState.status === "success" && (
                    <Stack spacing={2}>
                        {tosState.paragraphs.map((paragraph, index) => (
                            <Typography key={index} variant="body2" color="text.secondary">
                                {paragraph}
                            </Typography>
                        ))}
                    </Stack>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleDecline} variant="contained" color="error">
                    No I don't
                </Button>
                <Button onClick={onAccept} variant="contained">
                    Accept TOS
                </Button>
            </DialogActions>
        </Dialog>
    );
}