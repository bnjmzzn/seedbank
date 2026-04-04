"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import PasswordField from "./shared/PasswordField";
import { loginSchema, type LoginInput } from "@/lib/client/validation";
import { showSnackbar } from "@/components/shared/SnackBar";
import { api } from "@/lib/client/api";
import { storage } from "@/lib/client/storage";
import useUserStore from "@/store/useUserStore";
import { useEffect } from "react";

interface Props {
    onLoadingChange?: (loading: boolean) => void;
}

export default function({ onLoadingChange }: Props) {
    const router = useRouter();
    const setUser = useUserStore((state) => state.setUser);
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        onLoadingChange?.(isSubmitting);
    }, [isSubmitting]);

    const onSubmit = async (data: LoginInput) => {
        try {
            const res = await api.auth.login(data);
            const { token, user } = res.data.data;
            storage.setToken(token);
            setUser(user.username, user.balance);
            showSnackbar("Welcome back!", "success");
            router.push("/dashboard");
        } catch (error: any) {
            showSnackbar(error, "error");
        }
    };

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