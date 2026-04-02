import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/(api)/api/play/route";
import { AppError, Errors } from "@/lib/server/error";

vi.mock("@/lib/server/services/game", () => ({
    playGame: vi.fn(),
}));

import { playGame } from "@/lib/server/services/game";

function makeRequest(body: unknown, userId?: string) {
    return new Request("http://localhost/api/play", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(userId ? { "x-user-id": userId } : {}),
        },
        body: JSON.stringify(body),
    });
}

const validBody = { game: "GAME:COINFLIP", bet: 50 };

describe("POST /api/play", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns 400 if game is missing", async () => {
        const res = await POST(makeRequest({ bet: 50 }, "user-123"));
        expect(res.status).toBe(400);
    });

    it("returns 400 if bet is missing", async () => {
        const res = await POST(makeRequest({ game: "GAME:COINFLIP" }, "user-123"));
        expect(res.status).toBe(400);
    });

    it("returns 400 if bet is not an integer", async () => {
        const res = await POST(makeRequest({ game: "GAME:COINFLIP", bet: 1.5 }, "user-123"));
        expect(res.status).toBe(400);
    });

    it("returns 400 if game is not a valid enum value", async () => {
        const res = await POST(makeRequest({ game: "GAME:INVALID", bet: 50 }, "user-123"));
        expect(res.status).toBe(400);
    });

    it("returns 401 if no user id header", async () => {
        const res = await POST(makeRequest(validBody));
        expect(res.status).toBe(401);
    });

    it("returns 200 on success", async () => {
        vi.mocked(playGame).mockResolvedValueOnce({ won: true, delta: 50, balance: 550 });

        const res = await POST(makeRequest(validBody, "user-123"));
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.data.won).toBe(true);
        expect(body.data.delta).toBe(50);
    });

    it("returns 400 if insufficient balance", async () => {
        vi.mocked(playGame).mockRejectedValueOnce(new AppError(Errors.INSUFFICIENT_BALANCE));

        const res = await POST(makeRequest(validBody, "user-123"));
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.code).toBe("INSUFFICIENT_BALANCE");
    });

    it("returns 500 if service throws unexpectedly", async () => {
        vi.mocked(playGame).mockRejectedValueOnce(new Error("db exploded"));
        const res = await POST(makeRequest(validBody, "user-123"));
        expect(res.status).toBe(500);
    });
});