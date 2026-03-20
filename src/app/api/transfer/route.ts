import { transferSeeds } from "@/lib/services/transfer";
import { successResponse } from "@/lib/api/response";
import { AppError, Errors, handleApiError } from "@/lib/error";

export async function POST(request: Request) {
    try {
        let body: { toUsername: string; amount: number };
        try {
            body = await request.json();
            if (!body.toUsername || !body.amount) throw new Error();
            if (!Number.isInteger(body.amount)) throw new Error();
        } catch {
            throw new AppError(Errors.INVALID_BODY);
        }

        const userId = request.headers.get("x-user-id");
        if (!userId) throw new AppError(Errors.UNAUTHORIZED);

        const result = await transferSeeds(userId, body.toUsername, body.amount);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}