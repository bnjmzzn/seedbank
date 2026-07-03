import { getMe } from "@/lib/server/services/users";
import { successResponse } from "@/lib/server/api/response";
import { AppError, Errors, handleApiError } from "@/lib/server/error";

export async function GET(request: Request) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) throw new AppError(Errors.UNAUTHORIZED);

        const result = await getMe(userId);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}