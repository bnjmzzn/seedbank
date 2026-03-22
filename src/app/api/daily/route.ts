import { claimDaily } from "@/lib/server/services/daily";
import { successResponse } from "@/lib/server/api/response";
import { AppError, Errors, handleApiError } from "@/lib/server/error";

export async function POST(request: Request) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) throw new AppError(Errors.UNAUTHORIZED);

        const result = await claimDaily(userId);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}