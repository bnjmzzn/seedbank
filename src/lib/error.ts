import { errorResponse } from "./api/response";

export const Errors = {
    USER_NOT_FOUND: { code: "USER_NOT_FOUND", status: 404 },
    USERNAME_TAKEN: { code: "USERNAME_TAKEN", status: 409 },
    INVALID_CREDENTIALS: { code: "INVALID_CREDENTIALS", status: 401 },
    INSUFFICIENT_BALANCE: { code: "INSUFFICIENT_BALANCE", status: 400 },
    INVALID_BODY: { code: "INVALID_BODY", status: 400 },
    COOLDOWN_ACTIVE: { code: "COOLDOWN_ACTIVE", status: 429 },
    UNAUTHORIZED: { code: "UNAUTHORIZED", status: 401 },
    SELF_TRANSFER: { code: "SELF_TRANSFER", status: 400 },
    TRANSFER_LIMIT: { code: "TRANSFER_LIMIT", status: 400 },
    STEAL_LIMIT: { code: "STEAL_LIMIT", status: 400 },
    SELF_STEAL: { code: "SELF_STEAL", status: 400 },
} as const;

type ErrorDefinition = typeof Errors[keyof typeof Errors];

export class AppError extends Error {
    public code: string;
    public status: number;
    public data?: unknown;

    constructor(error: ErrorDefinition, data?: unknown) {
        super(error.code);
        this.name = "AppError";
        this.code = error.code;
        this.status = error.status;
        this.data = data;
    }
}

export function handleApiError(error: unknown) {
    if (error instanceof AppError) {
        return errorResponse(error.code, error.status, error.data);
    }
    
    console.error(error);
    return errorResponse("INTERNAL_ERROR", 500);
}