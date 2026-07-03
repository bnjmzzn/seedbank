"use client";

import { useEffect, useState } from "react";
import { Stack, Button } from "@mui/material";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import LabeledField from "./shared/LabeledField";
import PasswordField from "./shared/PasswordField";
import TosDialog from "./TosDialog";
import { registerSchema, type RegisterInput } from "@/lib/client/validation";
import { showSnackbar } from "@/components/shared/generic/SnackBar";
import { api } from "@/lib/client/api";
import { getErrorMessage } from "@/lib/client/errors";
import { useInvisibleCaptcha } from "@/lib/client/hooks/ui";
import { HCAPTCHA_SITE_KEY } from "@/lib/config";

interface Props {
    onLoadingChange?: (loading: boolean) => void;
    onSuccess?: () => void;
}

export default function RegisterForm({ onLoadingChange, onSuccess }: Props) {
    const { captchaRef, requestToken, handleVerify, handleError, resetCaptcha } = useInvisibleCaptcha();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [pendingSubmit, setPendingSubmit] = useState(false);
    const [pendingData, setPendingData] = useState<RegisterInput | null>(null);
    const [tosOpen, setTosOpen] = useState(false);

    useEffect(() => {
        onLoadingChange?.(pendingSubmit);
    }, [pendingSubmit]);

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
        setUsernameError("");
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
        setPasswordError("");
    }

    function handleConfirmPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError("");
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (pendingSubmit) return;

        const parsed = registerSchema.safeParse({ username, password, confirmPassword });

        if (!parsed.success) {
            for (const issue of parsed.error.issues) {
                if (issue.path[0] === "username") setUsernameError(issue.message);
                if (issue.path[0] === "password") setPasswordError(issue.message);
                if (issue.path[0] === "confirmPassword") setConfirmPasswordError(issue.message);
            }
            return;
        }

        setPendingData(parsed.data);
        setPendingSubmit(true);
        setTosOpen(true);
    }

    async function handleTosAccept() {
        setTosOpen(false);

        if (!pendingData) {
            setPendingSubmit(false);
            return;
        }

        try {
            const captchaToken = await requestToken();
            await api.auth.register({ ...pendingData, captchaToken });
            showSnackbar("Account created! Please login.", "success");
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            onSuccess?.();
        } catch (error: any) {
            resetCaptcha();

            if (error.code === "USERNAME_TAKEN") {
                setUsernameError("That username is already taken.");
                showSnackbar(getErrorMessage(error.code), "error");
            } else if (error.code === "INVALID_USERNAME") {
                setUsernameError("That username isn't allowed.");
                showSnackbar(getErrorMessage(error.code), "error");
            } else {
                showSnackbar(getErrorMessage(error.code), "error");
            }
        } finally {
            setPendingData(null);
            setPendingSubmit(false);
        }
    }

    return (
        <>
            <Stack component="form" onSubmit={handleSubmit} spacing={2} noValidate>
                <LabeledField
                    label="Username"
                    errorMessage={usernameError}
                    value={username}
                    onChange={handleUsernameChange}
                    disabled={pendingSubmit}
                />
                <PasswordField
                    label="Password"
                    errorMessage={passwordError}
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={pendingSubmit}
                />
                <PasswordField
                    label="Confirm Password"
                    errorMessage={confirmPasswordError}
                    showToggle={false}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    disabled={pendingSubmit}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    loading={pendingSubmit}
                    disabled={pendingSubmit}
                >
                    Create Account
                </Button>
            </Stack>

            <TosDialog open={tosOpen} onAccept={handleTosAccept} />

            <HCaptcha
                ref={captchaRef}
                sitekey={HCAPTCHA_SITE_KEY}
                size="invisible"
                onVerify={handleVerify}
                onError={handleError}
                onChalExpired={handleError}
            />
        </>
    );
}