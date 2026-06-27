"use client";

import { TextField, TextFieldProps } from "@mui/material";

interface Props extends Omit<TextFieldProps, "label" | "error"> {
    label: string;
    errorMessage: string;
}

export default function LabeledField({ label, errorMessage, ...props }: Props) {
    const hasError = errorMessage !== "";

    return (
        <TextField
            {...props}
            label={hasError ? errorMessage : label}
            error={hasError}
            size="small"
            fullWidth
        />
    );
}