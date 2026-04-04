"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Stack, TextField, Button, Checkbox, FormControlLabel,
    FormHelperText, Dialog, DialogTitle, DialogContent,
    DialogActions, Box, Typography, CircularProgress,
} from "@mui/material";
import PasswordField from "./shared/PasswordField";
import { registerSchema, type RegisterInput } from "@/lib/client/validation";
import { showSnackbar } from "@/components/shared/SnackBar";
import { api } from "@/lib/client/api";

interface Props {
    onLoadingChange?: (loading: boolean) => void;
    onSuccess?: () => void;
}

export default function RegisterForm({ onLoadingChange, onSuccess }: Props) {
    const [tosOpen, setTosOpen] = useState(false);
    const [tosText, setTosText] = useState<string | null>(null);
    const [tosLoading, setTosLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
            tosAccepted: false as unknown as true,
        },
    });

    useEffect(() => {
        onLoadingChange?.(isSubmitting);
    }, [isSubmitting]);

    const openTos = async () => {
        setTosOpen(true);
        if (tosText !== null) return;
        setTosLoading(true);
        const res = await fetch("/tos.txt");
        setTosText(await res.text());
        setTosLoading(false);
    };

    const onSubmit = async (data: RegisterInput) => {
        try {
            await api.auth.register(data);
            showSnackbar("Account created! Please login.", "success");
            reset();
            onSuccess?.();
        } catch (error: any) {
            showSnackbar(error, "error");
        }
    };

    return (
        <>
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
                <Box>
                    <FormControlLabel
                        control={
                            <Controller
                                name="tosAccepted"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        {...field}
                                        checked={field.value}
                                        size="small"
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        }
                        label={
                            <Typography variant="body2">
                                I agree to the{" "}
                                <Box
                                    component="span"
                                    onClick={openTos}
                                    sx={{
                                        color: "primary.main",
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                    }}
                                >
                                    Terms of Service
                                </Box>
                            </Typography>
                        }
                    />
                    {errors.tosAccepted && (
                        <FormHelperText error sx={{ mx: "14px" }}>
                            {errors.tosAccepted.message}
                        </FormHelperText>
                    )}
                </Box>
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

            <Dialog open={tosOpen} onClose={() => setTosOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Terms of Service</DialogTitle>
                <DialogContent dividers>
                    {tosLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ whiteSpace: "pre-wrap" }}
                        >
                            {tosText}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTosOpen(false)} variant="outlined">Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}