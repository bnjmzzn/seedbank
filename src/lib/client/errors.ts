import { CURRENCY_TICKER } from "@/lib/config";

const ERROR_MESSAGES: Record<string, string> = {
    INVALID_CREDENTIALS: "Invalid username or password",
    USERNAME_TAKEN: "That username is already taken",
    COOLDOWN_ACTIVE: "You already claimed your daily reward",
    INSUFFICIENT_BALANCE: `You don't have enough ${CURRENCY_TICKER}`,
    SELF_TRANSFER: "You can't transfer to yourself",
    SELF_STEAL: "You can't steal from yourself",
    TRANSFER_LIMIT: "Amount is outside the allowed transfer range",
    STEAL_LIMIT: "Amount is outside the allowed steal range",
    USER_NOT_FOUND: "User not found",
    INVALID_BODY: "Invalid input",
    UNAUTHORIZED: "You are not logged in",
    SERVER_ERROR: "Something went wrong on the server",
    NETWORK_ERROR: "Could not reach the server",
};

export function getErrorMessage(code: string): string {
    return ERROR_MESSAGES[code] ?? ERROR_MESSAGES["SERVER_ERROR"];
}