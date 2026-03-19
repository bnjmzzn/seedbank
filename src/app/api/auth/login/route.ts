import { fetchUser } from "@/lib/db/user";
import { successResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const JWT_EXPIRES = "7d";

export async function POST(request: Request) {
    try {
        let body;

        try {
            body = await request.json();
            body.username = body.username?.trim();
            if (!body.username || !body.password) throw new Error();
        } catch {
            throw new Error("INVALID_BODY");
        }

        let user;

        try {
            user = await fetchUser("username", body.username);
        } catch (error) {
            // catch only if error is user not found
            if (error instanceof Error && error.message === "USER_NOT_FOUND") {
                throw new Error("INVALID_CREDENTIALS");
            }
            throw error;
        }

        const valid = await bcrypt.compare(body.password, user.password);
        if (!valid) throw new Error("INVALID_CREDENTIALS");

        const token = await new SignJWT({ id: user.id, username: user.username })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime(JWT_EXPIRES)
            .sign(JWT_SECRET);

        const { password, ...safeUser } = user;

        return successResponse({ token, user: safeUser });
    } catch (error) {
        return handleApiError(error);
    }
}