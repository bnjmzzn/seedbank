"use client";

import { useState } from "react";
import { TextField, InputAdornment, IconButton, TextFieldProps } from "@mui/material";
import Iconify from "@/components/shared/Iconify";

interface Props extends Omit<TextFieldProps, "type"> {
    showToggle?: boolean;
}

export default function PasswordField({ showToggle = true, ...props }: Props) {
    const [show, setShow] = useState(false);

    return (
        <TextField
            {...props}
            size="small"
            fullWidth
            type="text"
            slotProps={{
                htmlInput: {
                    autoComplete: "new-password",
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