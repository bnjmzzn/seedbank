import { registerUser } from "@/lib/server/services/users";
import { successResponse } from "@/lib/server/api/response";
import { AppError, Errors, handleApiError } from "@/lib/server/error";

export async function POST(request: Request) {
    try {
        let body;
        try {
            body = await request.json();
            body.username = body.username?.trim();
            if (!body.username || !body.password) throw new Error();
        } catch {
            throw new AppError(Errors.INVALID_BODY);
        }

        await registerUser(body.username, body.password);
        return successResponse();
    } catch (error) {
        return handleApiError(error);
    }
}