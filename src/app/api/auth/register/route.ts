import { createUser } from "@/lib/db/user";
import { successResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        let body;

        try {
            body = await request.json();
            if (!body.username || !body.password) throw new Error();
        } catch {
            throw new Error("INVALID_BODY");
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        await createUser(body.username, hashedPassword);

        return successResponse();
    } catch (error) {
        return handleApiError(error);
    }
}