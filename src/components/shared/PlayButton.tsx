"use client";

import { Button } from "@mui/material";

interface Props {
    onClick: () => void;
    disabled?: boolean;
    label?: string;
}

export default function PlayButton({ onClick, disabled, label = "Play" }: Props) {
    return (
        <Button variant="contained" onClick={onClick} disabled={disabled} fullWidth>
            {label}
        </Button>
    );
}