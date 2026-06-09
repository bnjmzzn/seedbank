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
            <ToggleButtonGroup
                value={value}
                exclusive
                onChange={(_, val) => val !== null && onChange(val)}
                disabled={disabled}
            >
                <ToggleButton value="heads">Heads</ToggleButton>
                <ToggleButton value="tails">Tails</ToggleButton>
            </ToggleButtonGroup>

            {error !== null && error !== undefined && (
                <Typography variant="caption" color="error.main">
                    {error}
                </Typography>
            )}
        </>
    );
}