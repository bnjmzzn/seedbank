import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types/api';

export function successResponse<T>(data?: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json({ success: true, data, message });
}

export function errorResponse(message: string, status = 400, data?: unknown): NextResponse<ApiResponse> {
    return NextResponse.json({ success: false, message, data }, { status });
}