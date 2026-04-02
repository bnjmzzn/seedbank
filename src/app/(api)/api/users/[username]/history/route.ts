import { getUserHistory } from "@/lib/server/services/history";
import { successResponse } from "@/lib/server/api/response";
import { handleApiError } from "@/lib/server/error";
import { HISTORY_DEFAULT_LIMIT } from "@/lib/config";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") ?? HISTORY_DEFAULT_LIMIT.toString());

        const result = await getUserHistory(username, limit);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}