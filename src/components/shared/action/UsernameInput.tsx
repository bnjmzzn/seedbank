"use client";

import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { getErrorMessage } from "@/lib/client/errors";
import { z } from "zod";

interface Props {
    username: string;
    setUsername: (value: string) => void;
    currentUsername: string | null;
    selfErrorCode: string;
    isLocked?: boolean;
    schema: z.ZodString;
    externalError?: string | null;
    onExternalErrorClear?: () => void;
    resetSignal?: number;
}

interface Validation {
    error: boolean;
    message: string;
}

function validate(value: string, currentUsername: string | null, selfErrorCode: string, schema: z.ZodString): Validation {
    if (value === "") return { error: true, message: "Enter username" };

    const isSelf = currentUsername !== null && value.toLowerCase() === currentUsername.toLowerCase();
    if (isSelf) return { error: true, message: getErrorMessage(selfErrorCode) };

    const parsed = schema.safeParse(value);
    if (!parsed.success) return { error: true, message: parsed.error.issues[0].message };

    return { error: false, message: "" };
}

export default function UsernameInput({
    username,
    setUsername,
    currentUsername,
    selfErrorCode,
    isLocked,
    schema,
    externalError,
    onExternalErrorClear,
    resetSignal,
}: Props) {
    const [raw, setRaw] = useState(username);

    useEffect(() => {
        setRaw("");
    }, [resetSignal]);

    const internal = validate(raw, currentUsername, selfErrorCode, schema);
    const isError = externalError ? true : internal.error;
    const errorMessage = externalError ? externalError : internal.message;

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setRaw(value);

        if (externalError && onExternalErrorClear) {
            onExternalErrorClear();
        }

        const { error } = validate(value, currentUsername, selfErrorCode, schema);
        setUsername(error ? "" : value);
    }

    return (
        <TextField
            label={isError ? errorMessage : "Username"}
            value={raw}
            onChange={handleChange}
            size="small"
            fullWidth
            error={isError}
            disabled={isLocked}
        />
    );
}