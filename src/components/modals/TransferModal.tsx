"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Avatar,
    CircularProgress,
    IconButton,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { transferSchema, TransferInput } from "@/lib/client/validation";
import { api } from "@/lib/client/api";
import { showSnackbar } from "@/components/shared/SnackBar";
import { getAvatarUrl } from "@/lib/client/avatar";
import useUserStore from "@/store/useUserStore";

let openTrigger: () => void;
export const openTransferModal = () => openTrigger?.();

const COUNTDOWN_START = 3;

type ModalState = "idle" | "checking" | "submitting";

interface RecipientProfile {
    username: string;
    balance: number;
}

interface SummaryRowProps {
    username: string;
    currentBalance: number;
    balanceAfter: number;
    amount: number;
    variant: "sender" | "receiver";
}

function SummaryRow({ username, currentBalance, balanceAfter, amount, variant }: SummaryRowProps) {
    const isSender = variant === "sender";
    const color = isSender ? "error.main" : "success.main";
    const sign = isSender ? "-" : "+";

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                borderRadius: 2,
                px: 2,
                py: 1.5,
            }}
        >
            <Avatar src={getAvatarUrl(username)} sx={{ width: 36, height: 36, flexShrink: 0 }} />

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                    @{username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {currentBalance.toLocaleString()} → {balanceAfter.toLocaleString()}
                </Typography>
            </Box>

            <Typography variant="body1" fontWeight={800} color={color} flexShrink={0}>
                {sign}{amount.toLocaleString()}
            </Typography>
        </Box>
    );
}

interface FormPageProps {
    control: any;
    errors: any;
    isChecking: boolean;
    balance: number | null;
}

function FormPage({ control, errors, isChecking, balance }: FormPageProps) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
                name="username"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Recipient username"
                        error={!!errors.username}
                        helperText={errors.username?.message ?? " "}
                        fullWidth
                        disabled={isChecking}
                    />
                )}
            />
            <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Amount"
                        type="number"
                        value={field.value === 0 ? "" : field.value}
                        onChange={(e) => field.onChange((e.target as HTMLInputElement).valueAsNumber)}
                        error={!!errors.amount}
                        helperText={
                            errors.amount?.message ??
                            (balance !== null
                                ? `Your balance: ${balance.toLocaleString()} seeds`
                                : " ")
                        }
                        fullWidth
                        disabled={isChecking}
                    />
                )}
            />
        </Box>
    );
}

interface SummaryPageProps {
    senderUsername: string;
    recipientProfile: RecipientProfile;
    amount: number;
    senderBalance: number;
}

function SummaryPage({ senderUsername, recipientProfile, amount, senderBalance }: SummaryPageProps) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <SummaryRow
                username={senderUsername}
                currentBalance={senderBalance}
                balanceAfter={senderBalance - amount}
                amount={amount}
                variant="sender"
            />
            <SummaryRow
                username={recipientProfile.username}
                currentBalance={recipientProfile.balance}
                balanceAfter={recipientProfile.balance + amount}
                amount={amount}
                variant="receiver"
            />
        </Box>
    );
}

interface StepOneActionsProps {
    onCancel: () => void;
    onProceed: () => void;
    isChecking: boolean;
}

function StepOneActions({ onCancel, onProceed, isChecking }: StepOneActionsProps) {
    return (
        <>
            <Button onClick={onCancel} color="inherit" disabled={isChecking}>
                Cancel
            </Button>
            <Button
                variant="contained"
                onClick={onProceed}
                disabled={isChecking}
                startIcon={isChecking ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : null}
            >
                {isChecking ? "Checking..." : "Proceed"}
            </Button>
        </>
    );
}

interface StepTwoActionsProps {
    onBack: () => void;
    onConfirm: () => void;
    isSubmitting: boolean;
    countdown: number | null;
}

function StepTwoActions({ onBack, onConfirm, isSubmitting, countdown }: StepTwoActionsProps) {
    return (
        <>
            <Button onClick={onBack} color="inherit" disabled={isSubmitting}>
                Back
            </Button>
            <Button
                variant="contained"
                onClick={onConfirm}
                disabled={isSubmitting || countdown !== null}
                startIcon={isSubmitting ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : null}
            >
                {isSubmitting
                    ? "Transferring..."
                    : countdown !== null
                    ? `Confirm (${countdown})`
                    : "Confirm"}
            </Button>
        </>
    );
}

export default function TransferModal() {
    const { balance, setBalance } = useUserStore();

    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [modalState, setModalState] = useState<ModalState>("idle");
    const [recipientProfile, setRecipientProfile] = useState<RecipientProfile | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);

    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const {
        control,
        watch,
        setError,
        reset,
        getValues,
        formState: { errors },
    } = useForm<TransferInput>({
        resolver: zodResolver(transferSchema),
        defaultValues: { username: "", amount: 0 },
        mode: "onSubmit",
    });

    const amountValue = watch("amount");

    useEffect(() => {
        openTrigger = () => {
            reset();
            setStep(1);
            setModalState("idle");
            setRecipientProfile(null);
            setCountdown(null);
            setOpen(true);
        };
    }, [reset]);

    useEffect(() => {
        if (step !== 2) return;

        setCountdown(COUNTDOWN_START);
        countdownRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(countdownRef.current!);
                    return null;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [step]);

    const handleClose = () => {
        if (countdownRef.current) clearInterval(countdownRef.current);
        reset();
        setStep(1);
        setModalState("idle");
        setRecipientProfile(null);
        setCountdown(null);
        setOpen(false);
    };

    const handleProceed = async () => {
        const { username, amount } = getValues();

        if (balance !== null && amount > balance) {
            setError("amount", { message: "Insufficient balance" });
            return;
        }

        if (username.trim() === useUserStore.getState().username) {
            setError("username", { message: "You can't transfer to yourself" });
            return;
        }

        setModalState("checking");
        try {
            const res = await api.user.profile(username.trim());
            setRecipientProfile({
                username: res.data.data.username,
                balance: res.data.data.balance,
            });
            setStep(2);
        } catch {
            setError("username", { message: "User not found" });
        } finally {
            setModalState("idle");
        }
    };

    const handleSubmit = async () => {
        const { username, amount } = getValues();
        setModalState("submitting");
        try {
            const res = await api.transfer(username.trim(), amount);
            setBalance(res.data.data.balance);
            showSnackbar(`Transferred ${amount.toLocaleString()} seeds to @${username.trim()}`, "success");
            handleClose();
        } catch (error: any) {
            showSnackbar(error, "error");
            handleClose();
        }
    };

    const isChecking = modalState === "checking";
    const isSubmitting = modalState === "submitting";
    const senderUsername = useUserStore.getState().username ?? "";

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                elevation: 2
            }}
            >
            <DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="h6" fontWeight={700}>Transfer Seeds</Typography>
                    <IconButton size="small" onClick={handleClose} disabled={isSubmitting}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <Stepper activeStep={step - 1} sx={{ px: 3, pb: 2 }}>
                <Step><StepLabel>Details</StepLabel></Step>
                <Step><StepLabel>Summary</StepLabel></Step>
            </Stepper>

            <DialogContent sx={{ pt: 1 }}>
                {step === 1 && (
                    <FormPage
                        control={control}
                        errors={errors}
                        isChecking={isChecking}
                        balance={balance}
                    />
                )}
                {step === 2 && recipientProfile && (
                    <SummaryPage
                        senderUsername={senderUsername}
                        recipientProfile={recipientProfile}
                        amount={amountValue}
                        senderBalance={balance ?? 0}
                    />
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                {step === 1 && (
                    <StepOneActions
                        onCancel={handleClose}
                        onProceed={handleProceed}
                        isChecking={isChecking}
                    />
                )}
                {step === 2 && (
                    <StepTwoActions
                        onBack={() => setStep(1)}
                        onConfirm={handleSubmit}
                        isSubmitting={isSubmitting}
                        countdown={countdown}
                    />
                )}
            </DialogActions>
        </Dialog>
    );
}