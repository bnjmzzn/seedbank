import { stealBalance } from "@/lib/server/services/steal";
import { successResponse } from "@/lib/server/api/response";
import { AppError, Errors, handleApiError } from "@/lib/server/error";

export async function POST(request: Request) {
    try {
        let body: { fromUsername: string; amount: number };
        try {
            body = await request.json();
            if (!body.fromUsername || !body.amount) throw new Error();
            if (!Number.isInteger(body.amount)) throw new Error();
        } catch {
            throw new AppError(Errors.INVALID_BODY);
        }

        const userId = request.headers.get("x-user-id");
        if (!userId) throw new AppError(Errors.UNAUTHORIZED);

        const result = await stealBalance(userId, body.fromUsername, body.amount);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}