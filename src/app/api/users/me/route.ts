import { fetchUser } from "@/lib/db/user";
import { successResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

export async function GET(request: Request) {
    try {
        const userId = request.headers.get("x-user-id")!;
        const user = await fetchUser("id", userId);
        const { password, ...safeUser } = user;

        return successResponse(safeUser);
    } catch (error) {
        return handleApiError(error);
    }
}