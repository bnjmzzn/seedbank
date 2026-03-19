import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "@/lib/config";
import { errorResponse } from "@/lib/api/response";

const PROTECTED_ROUTES: string[] = [
    "/api/users/me",
    "/api/daily"
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    if (!isProtected) return NextResponse.next();

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return errorResponse("missing token", 401);
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", payload.id as string);
        requestHeaders.set("x-user-username", payload.username as string);

        return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
        return errorResponse("invalid or expired token", 401);
    }
}

export const config = {
    matcher: "/api/:path*",
};