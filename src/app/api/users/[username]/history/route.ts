import { getUserHistory } from "@/lib/services/history";
import { successResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/error";
import { HISTORY_DEFAULT_LIMIT } from "@/lib/config";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") ?? HISTORY_DEFAULT_LIMIT.toString());
        const offset = parseInt(searchParams.get("offset") ?? "0");

        const result = await getUserHistory(username, limit, offset);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}