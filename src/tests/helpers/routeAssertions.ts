import { expect } from "vitest";
import { Errors } from "@/lib/server/error";

export async function expectUnauthorizedWithoutUserId(
    handler: (request: Request) => Promise<Response>,
    request: Request,
) {
    const response = await handler(request);
    const json = await response.json();

    expect(response.status).toBe(Errors.UNAUTHORIZED.status);
    expect(json).toEqual({ success: false, code: Errors.UNAUTHORIZED.code, data: undefined });
}

export async function expectSuccessResponse(response: Response, expectedData: unknown) {
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true, data: expectedData });
}

export async function expectErrorResponse(response: Response, error: { code: string; status: number }) {
    const json = await response.json();

    expect(response.status).toBe(error.status);
    expect(json.success).toBe(false);
    expect(json.code).toBe(error.code);
}

export async function expectInternalErrorResponse(response: Response) {
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ success: false, code: "INTERNAL_ERROR", data: undefined });
}