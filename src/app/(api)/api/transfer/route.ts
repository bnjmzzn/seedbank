import { transferBalance } from "@/lib/server/services/transfer";
import { successResponse } from "@/lib/server/api/response";
import { AppError, Errors, handleApiError } from "@/lib/server/error";
import { transferBodySchema, parseBody } from "@/lib/server/validation";

export async function POST(request: Request) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) throw new AppError(Errors.UNAUTHORIZED);

        const body = parseBody(transferBodySchema, await request.json());
        const result = await transferBalance(userId, body.toUsername, body.amount);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}