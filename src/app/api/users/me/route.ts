import { getMe } from "@/lib/services/users";
import { successResponse } from "@/lib/api/response";
import { AppError, Errors, handleApiError } from "@/lib/error";

export async function GET(request: Request) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) throw new AppError(Errors.UNAUTHORIZED);

        const user = await getMe(userId);
        return successResponse(user);
    } catch (error) {
        return handleApiError(error);
    }
}