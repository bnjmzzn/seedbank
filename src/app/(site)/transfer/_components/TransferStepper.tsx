"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { transferSchema, type TransferInput } from "@/lib/client/validation";
import { api } from "@/lib/client/api";
import { showSnackbar } from "@/components/shared/SnackBar";
import useUserStore from "@/store/useUserStore";
import BalanceCard from "./BalanceCard";
import DetailsPanel from "./DetailsPanel";
import SummaryPanel from "./SummaryPanel";
import { mutate } from "swr";
import { TRANSFER_MIN, TRANSFER_MAX } from "@/lib/config";

interface RecipientProfile {
    username: string;
    balance: number;
}

interface Props {
    defaultTo?: string;
}

export default function TransferStepper({ defaultTo }: Props) {
    const { balance, setBalance, username } = useUserStore();

    const [step, setStep] = useState<1 | 2>(1);
    const [isChecking, setIsChecking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recipient, setRecipient] = useState<RecipientProfile | null>(null);

    const {
        control,
        watch,
        setError,
        clearErrors,
        getValues,
        formState: { errors },
    } = useForm<TransferInput>({
        resolver: zodResolver(transferSchema),
        defaultValues: { username: defaultTo ?? "", amount: 0 },
        mode: "onSubmit",
    });

    const amount = watch("amount");

    const handleProceed = async () => {
        const { username: toUsername, amount: toAmount } = getValues();

        if (!toUsername.trim()) {
            setError("username", { message: "Recipient username is required" });
            return;
        }
        if (!toAmount || toAmount <= 0) {
            setError("amount", { message: "Amount must be greater than 0" });
            return;
        }
        if (balance !== null && toAmount > balance) {
            setError("amount", { message: "Insufficient balance" });
            return;
        }
        if (toUsername.trim() === username) {
            setError("username", { message: "You can't transfer to yourself" });
            return;
        }
        if (toAmount < TRANSFER_MIN) {
            setError("amount", { message: `Minimum is ${TRANSFER_MIN} seed` });
            return;
        }
        if (toAmount > TRANSFER_MAX) {
            setError("amount", { message: `Maximum is ${TRANSFER_MAX.toLocaleString()} seeds` });
            return;
        }

        setIsChecking(true);
        try {
            const res = await api.user.profile(toUsername.trim());
            setRecipient({ username: res.data.data.username, balance: res.data.data.balance });
            setStep(2);
        } catch {
            setError("username", { message: "User not found" });
        } finally {
            setIsChecking(false);
        }
    };

    const handleCancel = () => {
        setStep(1);
        setRecipient(null);
    };

    const handleConfirm = async () => {
        const { username: toUsername, amount: toAmount } = getValues();
        setIsSubmitting(true);
        try {
            const res = await api.transfer(toUsername.trim(), toAmount);
            setBalance(res.data.data.balance);
            showSnackbar(`Transferred ${toAmount.toLocaleString()} seeds to @${toUsername.trim()}`, "success");
            mutate(["history", username, "TRANSFER", undefined]);
            setStep(1);
            setRecipient(null);
        } catch (error: any) {
            showSnackbar(error, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                <BalanceCard />
                <Stepper sx={{ flex: 1, px: 4, alignSelf: "center" }} activeStep={step - 1}>
                    <Step><StepLabel>Details</StepLabel></Step>
                    <Step><StepLabel>Summary</StepLabel></Step>
                </Stepper>
            </Box>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                <DetailsPanel
                    control={control}
                    errors={errors}
                    balance={balance}
                    isChecking={isChecking}
                    isConfirmed={step === 2}
                    onProceed={handleProceed}
                    onClearErrors={clearErrors}
                />
                <SummaryPanel
                    senderUsername={username ?? ""}
                    senderBalance={balance ?? 0}
                    recipient={recipient}
                    amount={amount}
                    isSubmitting={isSubmitting}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            </Box>
        </Box>
    );
}