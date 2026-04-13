import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/(api)/api/play/route";
import { AppError, Errors } from "@/lib/server/error";

vi.mock("@/lib/server/services/game", () => ({
    playGame: vi.fn(),
}));

import { playGame } from "@/lib/server/services/game";
import { BET_MIN, BET_MAX } from "@/lib/config";

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

const validBody = { game: "GAME:COINFLIP", bet: BET_MIN };

describe("POST /api/play", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns 401 if no user id header", async () => {
        const res = await POST(makeRequest(validBody));
        expect(res.status).toBe(401);
    });

    it("returns 400 if game is missing", async () => {
        const res = await POST(makeRequest({ bet: BET_MIN }, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("game");
    });

    it("returns 400 if bet is missing", async () => {
        const res = await POST(makeRequest({ game: "GAME:COINFLIP" }, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("bet");
    });

    it("returns 400 if bet is not an integer", async () => {
        const res = await POST(makeRequest({ game: "GAME:COINFLIP", bet: 1.5 }, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("bet");
    });

    it("returns 400 if bet is below minimum", async () => {
        const res = await POST(makeRequest({ game: "GAME:COINFLIP", bet: BET_MIN - 1 }, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("bet");
    });

    it("returns 400 if bet is above maximum", async () => {
        const res = await POST(makeRequest({ game: "GAME:COINFLIP", bet: BET_MAX + 1 }, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("bet");
    });

    it("returns 400 if game is not a valid enum value", async () => {
        const res = await POST(makeRequest({ game: "GAME:INVALID", bet: BET_MIN }, "user-123"));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("game");
    });

    it("returns 200 on success", async () => {
        vi.mocked(playGame).mockResolvedValueOnce({ won: true, delta: BET_MIN, balance: 550 });

        const res = await POST(makeRequest(validBody, "user-123"));
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.data.won).toBe(true);
        expect(body.data.delta).toBe(BET_MIN);
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