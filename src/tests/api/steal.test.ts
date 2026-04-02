import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/(api)/api/steal/route";
import { AppError, Errors } from "@/lib/server/error";

vi.mock("@/lib/server/services/steal", () => ({
    stealBalance: vi.fn(),
}));

import { stealBalance } from "@/lib/server/services/steal";

function makeRequest(body: unknown, userId?: string) {
    return new Request("http://localhost/api/steal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(userId ? { "x-user-id": userId } : {}),
        },
        body: JSON.stringify(body),
    });
}

const validBody = { fromUsername: "user2", amount: 100 };

describe("POST /api/steal", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns 400 if fromUsername is missing", async () => {
        const res = await POST(makeRequest({ amount: 100 }, "user-123"));
        expect(res.status).toBe(400);
    });

    it("returns 400 if amount is missing", async () => {
        const res = await POST(makeRequest({ fromUsername: "user2" }, "user-123"));
        expect(res.status).toBe(400);
    });

    it("returns 400 if amount is not an integer", async () => {
        const res = await POST(makeRequest({ fromUsername: "user2", amount: 1.5 }, "user-123"));
        expect(res.status).toBe(400);
    });

    it("returns 401 if no user id header", async () => {
        const res = await POST(makeRequest(validBody));
        expect(res.status).toBe(401);
    });

    it("returns 200 on success", async () => {
        vi.mocked(stealBalance).mockResolvedValueOnce({ success: true, delta: 100, balance: 900 });

        const res = await POST(makeRequest(validBody, "user-123"));
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.data.success).toBe(true);
        expect(body.data.delta).toBe(100);
    });

    it("returns 400 if insufficient balance", async () => {
        vi.mocked(stealBalance).mockRejectedValueOnce(new AppError(Errors.INSUFFICIENT_BALANCE));

        const res = await POST(makeRequest(validBody, "user-123"));
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.code).toBe("INSUFFICIENT_BALANCE");
    });

    it("returns 400 if self steal", async () => {
        vi.mocked(stealBalance).mockRejectedValueOnce(new AppError(Errors.SELF_STEAL));

        const res = await POST(makeRequest(validBody, "user-123"));
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.code).toBe("SELF_STEAL");
    });

    it("returns 400 if amount exceeds steal limit", async () => {
        vi.mocked(stealBalance).mockRejectedValueOnce(new AppError(Errors.STEAL_LIMIT));

        const res = await POST(makeRequest(validBody, "user-123"));
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.code).toBe("STEAL_LIMIT");
    });

    it("returns 500 if service throws unexpectedly", async () => {
        vi.mocked(stealBalance).mockRejectedValueOnce(new Error("db exploded"));
        const res = await POST(makeRequest(validBody, "user-123"));
        expect(res.status).toBe(500);
    });
});