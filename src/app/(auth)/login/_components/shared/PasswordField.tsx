"use client";

import { useState } from "react";
import { TextField, InputAdornment, IconButton, TextFieldProps } from "@mui/material";
import Iconify from "@/components/shared/generic/Iconify";

interface Props extends Omit<TextFieldProps, "type" | "label" | "error"> {
    label: string;
    errorMessage: string;
    showToggle?: boolean;
}

export default function PasswordField({ label, errorMessage, showToggle = true, ...props }: Props) {
    const [show, setShow] = useState(false);
    const hasError = errorMessage !== "";

    return (
        <TextField
            {...props}
            label={hasError ? errorMessage : label}
            error={hasError}
            size="small"
            fullWidth
            type="text"
            slotProps={{
                htmlInput: {
                    style: !show ? { WebkitTextSecurity: "disc" } : {},
                },
                input: {
                    endAdornment: showToggle ? (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShow((p) => !p)}
                                edge="end"
                                size="small"
                                disabled={!!props.disabled}
                            >
                                <Iconify icon={show ? "mdi:eye" : "mdi:eye-off"} />
                            </IconButton>
                        </InputAdornment>
                    ) : undefined,
                },
            }}
        />
    );
}