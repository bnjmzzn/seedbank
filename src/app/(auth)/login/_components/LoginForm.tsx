"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import PasswordField from "./shared/PasswordField";
import { loginSchema, type LoginInput } from "@/lib/client/validation";
import { showSnackbar } from "@/components/shared/generic/SnackBar";
import { api } from "@/lib/client/api";
import { storage } from "@/lib/client/storage";
import { getErrorMessage } from "@/lib/client/errors";

interface Props {
    onLoadingChange?: (loading: boolean) => void;
}

export default function LoginForm({ onLoadingChange }: Props) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        onLoadingChange?.(isSubmitting);
    }, [isSubmitting]);

    async function onSubmit(data: LoginInput) {
        try {
            const res = await api.auth.login(data);
            const { token } = res.data.data;
            storage.setToken(token);
            showSnackbar("Welcome!", "enter");
            router.push("/dashboard");
        } catch (error: any) {
            if (error.code === "INVALID_CREDENTIALS") {
                setError("username", { message: "" });
                setError("password", { message: "" });
                showSnackbar(getErrorMessage(error.code), "error");
            }
        }
    }

    return (
        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2} noValidate>
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
        </Stack>
    );
}