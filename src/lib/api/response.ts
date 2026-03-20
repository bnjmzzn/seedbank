import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";

export function successResponse<T>(data?: T): NextResponse<ApiResponse<T>> {
    
    return NextResponse.json({
        success: true,
        data: data
    });
}

export function errorResponse(
    code: string,
    status = 400,
    data?: unknown
): NextResponse<ApiResponse> {

    return NextResponse.json({
        success: false,
        code: code,
        data: data
    }, {
        status: status
    });
}