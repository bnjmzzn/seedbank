import { createUser } from "@/lib/db/user";
import { successResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import bcrypt from "bcryptjs";

const USERNAME_MAX = 20;
const PASSWORD_MAX = 100;
const HASH_ROUNDS = 10;

export async function POST(request: Request) {
    try {
        let body;

        try {
            body = await request.json();
            body.username = body.username?.trim();

            // frontend validates before sending request to api
            if (!body.username || !body.password) throw new Error();
            if (body.username.length > USERNAME_MAX) throw new Error();
            if (body.password.length > PASSWORD_MAX) throw new Error();
        } catch {
            throw new Error("INVALID_BODY");
        }

        const hashedPassword = await bcrypt.hash(body.password, HASH_ROUNDS);
        await createUser(body.username, hashedPassword);

        return successResponse();
    } catch (error) {
        return handleApiError(error);
    }
}