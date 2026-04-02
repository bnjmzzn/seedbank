import { getUserProfile } from "@/lib/server/services/users";
import { successResponse } from "@/lib/server/api/response";
import { handleApiError } from "@/lib/server/error";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;
        const result = await getUserProfile(username);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}