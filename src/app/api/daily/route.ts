import { claimDaily } from "@/lib/services/daily";
import { successResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/error";

export async function POST(request: Request) {
    try {
        const userId = request.headers.get("x-user-id")!;
        const result = await claimDaily(userId);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}