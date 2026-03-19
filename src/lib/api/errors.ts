import { NextResponse } from 'next/server';
import { errorResponse } from './response';

const ERROR_MAP: Record<string, { status: number; message: string }> = {
    INVALID_BODY:    { status: 400, message: 'invalid request body' },
    USERNAME_TAKEN:  { status: 409, message: 'username is already taken' },
    USER_NOT_FOUND:  { status: 404, message: 'user not found' },
};

export function handleApiError(error: unknown): NextResponse {
    const code = error instanceof Error ? error.message : null;
    const mapped = code ? ERROR_MAP[code] : null;

    if (mapped) {
        return errorResponse(mapped.message, mapped.status);
    }

    console.error(error);
    return errorResponse('internal server error', 500);
}