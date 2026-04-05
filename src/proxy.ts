import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "@/lib/server/config";
import { errorResponse } from "@/lib/server/api/response";
import { Errors } from "@/lib/server/error";

const PROTECTED_ROUTES: string[] = [
    "/api/daily",
    "/api/play",
    "/api/transfer",
    "/api/steal",
    "/api/users/me"
];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    if (!isProtected) return NextResponse.next();

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return errorResponse(Errors.UNAUTHORIZED.code, Errors.UNAUTHORIZED.status);
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", payload.id as string);
        requestHeaders.set("x-user-username", payload.username as string);

        return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
        return errorResponse(Errors.UNAUTHORIZED.code, Errors.UNAUTHORIZED.status);
    }
}

export const config = {
    matcher: "/api/:path*",
};