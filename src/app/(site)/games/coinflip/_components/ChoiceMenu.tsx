"use client";

import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

type CoinSide = "heads" | "tails";

interface Props {
    value: CoinSide | null;
    onChange: (value: CoinSide) => void;
    error?: string | null;
    disabled?: boolean;
}

export default function ChoiceMenu({ value, onChange, error, disabled }: Props) {
    return (
        <>
            <Typography
                sx={{ display: "block", minHeight: "1.5em", color: error ? "error.main" : "text.secondary" }}
            >
                {error ?? (value ? `Selected: ${value.charAt(0).toUpperCase() + value.slice(1)}` : "No selection")}
            </Typography>
            <ToggleButtonGroup
                value={value}
                exclusive
                onChange={(_, val) => val !== null && onChange(val)}
                disabled={disabled}
            >
                <ToggleButton value="heads">Heads</ToggleButton>
                <ToggleButton value="tails">Tails</ToggleButton>
            </ToggleButtonGroup>
        </>
    );
}