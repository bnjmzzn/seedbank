import { getUserHistory, VALID_FILTER } from "@/lib/server/services/history";
import { successResponse } from "@/lib/server/api/response";
import { AppError, Errors, handleApiError } from "@/lib/server/error";
import { HISTORY_DEFAULT_LIMIT } from "@/lib/config";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;
        const { searchParams } = new URL(request.url);

        const type = searchParams.get("type") ?? undefined;
        const limit = parseInt(searchParams.get("limit") ?? HISTORY_DEFAULT_LIMIT.toString());

        if (type && !VALID_FILTER.has(type)) throw new AppError(Errors.INVALID_BODY);

        const result = await getUserHistory(username, { type, limit });
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}