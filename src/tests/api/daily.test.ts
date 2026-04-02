import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/(api)/api/daily/route";
import { AppError, Errors } from "@/lib/server/error";

vi.mock("@/lib/server/services/daily", () => ({
    claimDaily: vi.fn(),
}));

import { claimDaily } from "@/lib/server/services/daily";

function makeRequest(userId?: string) {
    return new Request("http://localhost/api/daily", {
        method: "POST",
        headers: {
            ...(userId ? { "x-user-id": userId } : {}),
        },
    });
}

describe("POST /api/daily", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns 401 if no user id header", async () => {
        const res = await POST(makeRequest());
        expect(res.status).toBe(401);
    });

    it("returns 200 on success", async () => {
        vi.mocked(claimDaily).mockResolvedValueOnce({ claimed: 100, balance: 200 });

        const res = await POST(makeRequest("user-123"));
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.data.claimed).toBe(100);
    });

    it("returns 429 if cooldown active", async () => {
        vi.mocked(claimDaily).mockRejectedValueOnce(
            new AppError(Errors.COOLDOWN_ACTIVE, { remaining: 3600000 })
        );

        const res = await POST(makeRequest("user-123"));
        const body = await res.json();

        expect(res.status).toBe(429);
        expect(body.code).toBe("COOLDOWN_ACTIVE");
    });

    it("returns 500 if service throws unexpectedly", async () => {
        vi.mocked(claimDaily).mockRejectedValueOnce(new Error("db exploded"));
        const res = await POST(makeRequest("user-123"));
        expect(res.status).toBe(500);
    });
});