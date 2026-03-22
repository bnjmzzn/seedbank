"use client";

import { Controller } from "react-hook-form";
import { Bean } from "lucide-react";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput } from "@/components/ui/input-group";
import type { UseFormReturn } from "react-hook-form";
import type { Schema } from "./BombGame";

interface Props {
    form: UseFormReturn<Schema, any, Schema>;
    playing: boolean;
    onBet: (values: Schema) => void;
}

export default function BombBetForm({ form, playing, onBet }: Props) {
    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
                <Controller
                    name="bet"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="bet">Bet</FieldLabel>
                            <InputGroup aria-invalid={fieldState.invalid}>
                                <InputGroupAddon align="inline-start">
                                    <InputGroupText>
                                        <Bean size={14} />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                    {...(field as any)}
                                    id="bet"
                                    type="number"
                                    placeholder="0"
                                    min={5}
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
                    className="w-full"
                    disabled={playing}
                    onClick={form.handleSubmit(onBet)}
                >
                    {playing ? "Pick a card..." : "Place Bet"}
                </Button>
            </FieldGroup>
        </form>
    );
}