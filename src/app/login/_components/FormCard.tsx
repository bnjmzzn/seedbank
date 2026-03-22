"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginSchema } from "@/lib/client/validators";
import { login, register } from "@/lib/client/api";
import { setToken } from "@/lib/client/auth";

export default function FormCard() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState<"login" | "register" | null>(null);

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
    });

    async function onLogin(values: LoginSchema) {
        setSubmitting("login");
        try {
            const res = await login(values.username, values.password);
            setToken(res.data.token);
            router.replace("/dashboard");
        } catch (err: any) {
            const code = err.response?.data?.code;
            toast.error(code === "INVALID_CREDENTIALS" ? "Invalid username or password." : "Something went wrong.");
        } finally {
            setSubmitting(null);
        }
    }

    async function onRegister(values: LoginSchema) {
        setSubmitting("register");
        try {
            await register(values.username, values.password);
            toast.success("Account created! You can now log in.");
            form.reset();
        } catch (err: any) {
            const code = err.response?.data?.code;
            toast.error(code === "USERNAME_TAKEN" ? "Username is already taken." : "Something went wrong.");
        } finally {
            setSubmitting(null);
        }
    }

    function renderUsernameField() {
        return (
            <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <Input {...field} id="username" placeholder="username123" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
        );
    }

    function renderPasswordField() {
        return (
            <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div className="relative">
                            <Input
                                {...field}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                aria-invalid={fieldState.invalid}
                            />
                            <button
                                type="button"
                                onMouseDown={() => setShowPassword(true)}
                                onMouseUp={() => setShowPassword(false)}
                                onMouseLeave={() => setShowPassword(false)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground select-none"
                            >
                                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
        );
    }

    function renderButtons() {
        return (
            <div className="flex gap-2">
                <Button
                    type="button"
                    className="flex-1"
                    disabled={submitting !== null}
                    onClick={form.handleSubmit(onLogin)}
                >
                    {submitting === "login" ? "Logging in..." : "Login"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    disabled={submitting !== null}
                    onClick={form.handleSubmit(onRegister)}
                >
                    {submitting === "register" ? "Creating..." : "Register"}
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold">Seedbank</h1>
                <p className="text-muted-foreground text-sm mt-1">Enter your credentials to continue.</p>
            </div>
            <form>
                <FieldGroup>
                    {renderUsernameField()}
                    {renderPasswordField()}
                    {renderButtons()}
                </FieldGroup>
            </form>
        </div>
    );
}