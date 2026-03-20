import { loginUser } from "@/lib/services/users";
import { successResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/error";
import { AppError, Errors } from "@/lib/error";

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

        const result = await loginUser(body.username, body.password);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}