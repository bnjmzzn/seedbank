"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Bean, Swords } from "lucide-react";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput } from "@/components/ui/input-group";
import { stealSchema, type StealSchema } from "@/lib/client/validators";
import { steal } from "@/lib/client/api";
import { useUser } from "@/context/UserContext";

interface Props {
    onSuccess: () => void;
}

export default function StealForm({ onSuccess }: Props) {
    const { balance, setBalance } = useUser();
    const [submitting, setSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(stealSchema),
        defaultValues: { username: "", amount: "" },
    });

    async function onSubmit(values: StealSchema) {
        setSubmitting(true);
        try {
            const res = await steal(values.username, values.amount);
            const { success, delta, balance: newBalance } = res.data;
            setBalance(newBalance);
            if (success) {
                toast.success(`Stole ${Math.abs(delta).toLocaleString()} seeds from ${values.username}!`);
            } else {
                toast.error(`Steal failed! Lost ${Math.abs(delta).toLocaleString()} seeds.`);
            }
            onSuccess();
        } catch (err: any) {
            const code = err.response?.data?.code;
            const messages: Record<string, string> = {
                USER_NOT_FOUND:       "User not found.",
                INSUFFICIENT_BALANCE: "Not enough seeds (you or target).",
                SELF_STEAL:           "You can't steal from yourself.",
                STEAL_LIMIT:          "Amount out of allowed range.",
            };
            toast.error(messages[code] ?? "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="rounded-xl border-4 border-border bg-card p-6 space-y-5">
            <div>
                <h1 className="text-lg font-semibold text-foreground">Steal Seeds</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    50% chance to steal. Fail and you lose the same amount.{" "}
                    <span className="font-mono text-foreground">Balance: {balance.toLocaleString()}</span>
                </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
                <FieldGroup>
                    <Controller
                        name="username"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="from-username">Target</FieldLabel>
                                <Input
                                    {...field}
                                    id="from-username"
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
                                <FieldLabel htmlFor="steal-amount">Amount</FieldLabel>
                                <InputGroup aria-invalid={fieldState.invalid}>
                                    <InputGroupAddon align="inline-start">
                                        <InputGroupText>
                                            <Bean size={14} />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        {...(field as any)}
                                        id="steal-amount"
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
                        variant="destructive"
                        className="w-full gap-2"
                        disabled={submitting}
                        onClick={form.handleSubmit(onSubmit)}
                    >
                        <Swords size={15} />
                        {submitting ? "Stealing..." : "Attempt Steal"}
                    </Button>
                </FieldGroup>
            </form>
        </div>
    );
}