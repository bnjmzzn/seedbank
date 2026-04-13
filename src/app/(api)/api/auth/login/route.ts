import { loginUser } from "@/lib/server/services/users";
import { successResponse } from "@/lib/server/api/response";
import { handleApiError } from "@/lib/server/error";
import { loginBodySchema, parseBody } from "@/lib/server/validation";

export async function POST(request: Request) {
    try {
        const body = parseBody(loginBodySchema, await request.json());
        const result = await loginUser(body.username, body.password);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}