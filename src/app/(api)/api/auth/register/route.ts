import { registerUser } from "@/lib/server/services/users";
import { successResponse } from "@/lib/server/api/response";
import { handleApiError } from "@/lib/server/error";
import { registerBodySchema, parseBody } from "@/lib/server/validation";

export async function POST(request: Request) {
    try {
        const body = parseBody(registerBodySchema, await request.json());
        await registerUser(body.username, body.password);
        return successResponse();
    } catch (error) {
        return handleApiError(error);
    }
}