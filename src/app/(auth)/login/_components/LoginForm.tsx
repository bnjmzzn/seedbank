"use client";

import { useEffect, useState } from "react";
import { Stack, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import LabeledField from "./shared/LabeledField";
import PasswordField from "./shared/PasswordField";
import { loginSchema } from "@/lib/client/validation";
import { showSnackbar } from "@/components/shared/generic/SnackBar";
import { api } from "@/lib/client/api";
import { storage } from "@/lib/client/storage";
import { getErrorMessage } from "@/lib/client/errors";
import { useInvisibleCaptcha } from "@/lib/client/hooks/ui";
import { HCAPTCHA_SITE_KEY } from "@/lib/config";

interface Props {
    onLoadingChange?: (loading: boolean) => void;
}

type Status = "idle" | "submitting";

export default function LoginForm({ onLoadingChange }: Props) {
    const router = useRouter();
    const { captchaRef, requestToken, handleVerify, handleError, resetCaptcha } = useInvisibleCaptcha();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [status, setStatus] = useState<Status>("idle");

    const isSubmitting = status === "submitting";

    useEffect(() => {
        onLoadingChange?.(isSubmitting);
    }, [isSubmitting]);

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
        setUsernameError("");
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
        setPasswordError("");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (isSubmitting) return;

        const parsed = loginSchema.safeParse({ username, password });

        if (!parsed.success) {
            for (const issue of parsed.error.issues) {
                if (issue.path[0] === "username") setUsernameError(issue.message);
                if (issue.path[0] === "password") setPasswordError(issue.message);
            }
            return;
        }

        setStatus("submitting");

        try {
            const captchaToken = await requestToken();
            const res = await api.auth.login({ ...parsed.data, captchaToken });
            const { token } = res;
            storage.setToken(token);
            showSnackbar("Welcome!", "enter");
            router.push("/dashboard");
        } catch (error: any) {
            resetCaptcha();

            if (error.code === "INVALID_CREDENTIALS") {
                const message = getErrorMessage(error.code);
                setUsernameError(message);
                setPasswordError(message);
            } else {
                showSnackbar(getErrorMessage(error.code), "error");
            }

            setStatus("idle");
        }
    }

    return (
        <Stack component="form" onSubmit={handleSubmit} spacing={2} noValidate>
            <LabeledField
                label="Username"
                errorMessage={usernameError}
                value={username}
                onChange={handleUsernameChange}
                disabled={isSubmitting}
            />
            <PasswordField
                label="Password"
                errorMessage={passwordError}
                value={password}
                onChange={handlePasswordChange}
                disabled={isSubmitting}
            />
            <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                loading={isSubmitting}
                disabled={isSubmitting}
            >
                Login
            </Button>
            <HCaptcha
                ref={captchaRef}
                sitekey={HCAPTCHA_SITE_KEY}
                size="invisible"
                onVerify={handleVerify}
                onError={handleError}
                onChalExpired={handleError}
            />
        </Stack>
    );
}