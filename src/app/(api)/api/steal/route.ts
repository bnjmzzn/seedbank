import { stealBalance } from "@/lib/server/services/steal";
import { successResponse } from "@/lib/server/api/response";
import { AppError, Errors, handleApiError } from "@/lib/server/error";
import { stealBodySchema, parseBody } from "@/lib/server/validation";

export async function POST(request: Request) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) throw new AppError(Errors.UNAUTHORIZED);

        const body = parseBody(stealBodySchema, await request.json());
        const result = await stealBalance(userId, body.fromUsername, body.amount);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}