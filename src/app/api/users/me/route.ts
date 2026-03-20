import { getMe } from "@/lib/services/user";
import { successResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/error";

export async function GET(request: Request) {
    try {
        const userId = request.headers.get("x-user-id")!;
        const user = await getMe(userId);
        return successResponse(user);
    } catch (error) {
        return handleApiError(error);
    }
}