"use client";

import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface Props {
    label?: string;
    placeholder?: string;
    showToggle?: boolean;
}

export default function PasswordField({ label = "Password", placeholder = "••••••••", showToggle = true }: Props) {
    const [show, setShow] = useState(false);

    return (
        <TextField
            label={label}
            placeholder={placeholder}
            size="small"
            fullWidth
            type="text"
            slotProps={{
                htmlInput: {
                    autoComplete: "new-password",
                    style: !show ? {
                        WebkitTextSecurity: "disc",
                    } : {},
                },
                input: {
                    endAdornment: showToggle ? (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShow(p => !p)} edge="end" size="small">
                                {show ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                            </IconButton>
                        </InputAdornment>
                    ) : undefined,
                },
            }}
        />
    );
}