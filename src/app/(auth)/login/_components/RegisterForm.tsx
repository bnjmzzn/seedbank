"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, TextField, Button } from "@mui/material";
import PasswordField from "./shared/PasswordField";
import { registerSchema, type RegisterInput } from "@/lib/client/validation";
import { showSnackbar } from "@/components/shared/SnackBar";
import { api } from "@/lib/client/api";

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            await api.auth.register(data);
            showSnackbar("Account created! Please login.", "success");
            reset();
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
    );
}