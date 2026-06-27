"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, TextField, Button } from "@mui/material";
import PasswordField from "./shared/PasswordField";
import TosDialog from "./TosDialog";
import { registerSchema, type RegisterInput } from "@/lib/client/validation";
import { showSnackbar } from "@/components/shared/generic/SnackBar";
import { api } from "@/lib/client/api";
import { getErrorMessage } from "@/lib/client/errors";

interface Props {
    onLoadingChange?: (loading: boolean) => void;
    onSuccess?: () => void;
}

export default function RegisterForm({ onLoadingChange, onSuccess }: Props) {
    const [tosOpen, setTosOpen] = useState(false);
    const [pendingData, setPendingData] = useState<RegisterInput | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        onLoadingChange?.(isSubmitting);
    }, [isSubmitting]);

    const submitRegistration = async (data: RegisterInput) => {
        try {
            await api.auth.register(data);
            showSnackbar("Account created! Please login.", "success");
            reset();
            onSuccess?.();
        } catch (error: any) {
            if (error.code === "USERNAME_TAKEN") {
                setError("username", { message: "That username is already taken." });
            } else {
                showSnackbar(getErrorMessage(error.code), "error");
            }
        }
    };

    const onValidated = (data: RegisterInput) => {
        setPendingData(data);
        setTosOpen(true);
    };

    const handleTosAccept = () => {
        setTosOpen(false);

        if (pendingData) {
            submitRegistration(pendingData);
        }
    };

    return (
        <>
            <Stack component="form" onSubmit={handleSubmit(onValidated)} spacing={2} noValidate>
                <TextField
                    {...register("username")}
                    label="Username"
                    size="small"
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    disabled={isSubmitting}
                />
                <PasswordField
                    {...register("password")}
                    label="Password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={isSubmitting}
                />
                <PasswordField
                    {...register("confirmPassword")}
                    label="Confirm Password"
                    showToggle={false}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    disabled={isSubmitting}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                >
                    Create Account
                </Button>
            </Stack>

            <TosDialog open={tosOpen} onAccept={handleTosAccept} />
        </>
    );
}