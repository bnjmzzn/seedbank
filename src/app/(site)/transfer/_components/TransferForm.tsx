"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Bean, ArrowLeftRight } from "lucide-react";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput } from "@/components/ui/input-group";
import { transferSchema, type TransferSchema } from "@/lib/client/validators";
import { transfer } from "@/lib/client/api";
import { useUser } from "@/context/UserContext";

interface Props {
    onSuccess: () => void;
}

export default function TransferForm({ onSuccess }: Props) {
    const { balance, setBalance } = useUser();
    const [submitting, setSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(transferSchema),
        defaultValues: { username: "", amount: "" },
    });

    async function onSubmit(values: TransferSchema) {
        setSubmitting(true);
        try {
            const res = await transfer(values.username, values.amount);
            setBalance(res.data.balance);
            toast.success(`Sent ${values.amount.toLocaleString()} seeds to ${values.username}.`);
            form.reset();
            onSuccess();
        } catch (err: any) {
            const code = err.response?.data?.code;
            const messages: Record<string, string> = {
                USER_NOT_FOUND:       "User not found.",
                INSUFFICIENT_BALANCE: "Not enough seeds.",
                SELF_TRANSFER:        "You can't transfer to yourself.",
                TRANSFER_LIMIT:       "Amount out of allowed range.",
            };
            toast.error(messages[code] ?? "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="rounded-xl border-4 border-border bg-card p-6 space-y-5">
            <div>
                <h1 className="text-lg font-semibold text-foreground">Transfer Seeds</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Balance:{" "}
                    <span className="font-mono text-foreground">{balance.toLocaleString()}</span>
                </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
                <FieldGroup>
                    <Controller
                        name="username"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="to-username">Recipient</FieldLabel>
                                <Input
                                    {...field}
                                    id="to-username"
                                    placeholder="username"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="amount"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                                <InputGroup aria-invalid={fieldState.invalid}>
                                    <InputGroupAddon align="inline-start">
                                        <InputGroupText>
                                            <Bean size={14} />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        {...(field as any)}
                                        id="amount"
                                        type="number"
                                        placeholder="0"
                                        min={1}
                                        max={100_000_000}
                                        aria-invalid={fieldState.invalid}
                                    />
                                </InputGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Button
                        type="button"
                        className="w-full gap-2"
                        disabled={submitting}
                        onClick={form.handleSubmit(onSubmit)}
                    >
                        <ArrowLeftRight size={15} />
                        {submitting ? "Sending..." : "Send Seeds"}
                    </Button>
                </FieldGroup>
            </form>
        </div>
    );
}