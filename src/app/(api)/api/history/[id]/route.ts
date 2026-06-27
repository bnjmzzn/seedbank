import { getHistoryById } from "@/lib/server/services/history";
import { successResponse } from "@/lib/server/api/response";
import { handleApiError } from "@/lib/server/error";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const result = await getHistoryById(id);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}