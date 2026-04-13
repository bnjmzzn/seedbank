import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/(api)/api/transfer/route";
import { AppError, Errors } from "@/lib/server/error";

vi.mock("@/lib/server/services/transfer", () => ({
    transferBalance: vi.fn(),
}));

import { transferBalance } from "@/lib/server/services/transfer";
import { TRANSFER_MIN, TRANSFER_MAX } from "@/lib/config";

function makeRequest(body: unknown, userId?: string) {
    return new Request("http://localhost/api/transfer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(userId ? { "x-user-id": userId } : {}),
        },
        body: JSON.stringify(body),
    });
}

const validBody = { toUsername: "user2", amount: TRANSFER_MIN };

describe("POST /api/transfer", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns 401 if no user id header", async () => {
        const res = await POST(makeRequest(validBody));
        expect(res.status).toBe(401);
    });

    it("returns 400 if toUsername is missing", async () => {
        const res = await POST(makeRequest({ amount: TRANSFER_MIN }, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("toUsername");
    });

    it("returns 400 if amount is missing", async () => {
        const res = await POST(makeRequest({ toUsername: "user2" }, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("amount");
    });

    it("returns 400 if amount is not an integer", async () => {
        const res = await POST(makeRequest({ toUsername: "user2", amount: 1.5 }, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("amount");
    });

    it("returns 400 if amount is below minimum", async () => {
        const res = await POST(makeRequest({ toUsername: "user2", amount: TRANSFER_MIN - 1 }, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("amount");
    });

    it("returns 400 if amount is above maximum", async () => {
        const res = await POST(makeRequest({ toUsername: "user2", amount: TRANSFER_MAX + 1 }, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("amount");
    });

    it("returns 200 on success", async () => {
        vi.mocked(transferBalance).mockResolvedValueOnce({ transferred: TRANSFER_MIN, balance: 400 });

        const res = await POST(makeRequest(validBody, "user-123"));
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.data.transferred).toBe(TRANSFER_MIN);
    });

    it("returns 400 if insufficient balance", async () => {
        vi.mocked(transferBalance).mockRejectedValueOnce(new AppError(Errors.INSUFFICIENT_BALANCE));
        const res = await POST(makeRequest(validBody, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.code).toBe("INSUFFICIENT_BALANCE");
    });

    it("returns 400 if self transfer", async () => {
        vi.mocked(transferBalance).mockRejectedValueOnce(new AppError(Errors.SELF_TRANSFER));
        const res = await POST(makeRequest(validBody, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.code).toBe("SELF_TRANSFER");
    });

    it("returns 400 if transfer limit exceeded", async () => {
        vi.mocked(transferBalance).mockRejectedValueOnce(new AppError(Errors.TRANSFER_LIMIT));
        const res = await POST(makeRequest(validBody, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.code).toBe("TRANSFER_LIMIT");
    });

    it("returns 500 if service throws unexpectedly", async () => {
        vi.mocked(transferBalance).mockRejectedValueOnce(new Error("db exploded"));
        const res = await POST(makeRequest(validBody, "user-123"));
        expect(res.status).toBe(500);
    });
});