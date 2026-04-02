import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as getProfile } from "@/app/(api)/api/users/[username]/profile/route";
import { GET as getHistory } from "@/app/(api)/api/users/[username]/history/route";
import { AppError, Errors } from "@/lib/server/error";

vi.mock("@/lib/server/services/users", () => ({
    loginUser: vi.fn(),
    registerUser: vi.fn(),
    getUserProfile: vi.fn(),
}));

vi.mock("@/lib/server/services/history", () => ({
    getUserHistory: vi.fn(),
}));

import { getUserProfile } from "@/lib/server/services/users";
import { getUserHistory } from "@/lib/server/services/history";

function makeProfileRequest(username: string) {
    return new Request(`http://localhost/api/users/${username}/profile`);
}

function makeHistoryRequest(username: string, params?: Record<string, string>) {
    const url = new URL(`http://localhost/api/users/${username}/history`);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    return new Request(url);
}

function makeParams(username: string) {
    return { params: Promise.resolve({ username }) };
}

describe("GET /api/users/[username]/profile", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns 200 with profile data", async () => {
        vi.mocked(getUserProfile).mockResolvedValueOnce({
            username: "user1",
            balance: 1000,
            rank: 1,
            created_at: "2024-01-01",
        });

        const res = await getProfile(makeProfileRequest("user1"), makeParams("user1"));
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.data.username).toBe("user1");
        expect(body.data.rank).toBe(1);
    });

    it("returns 404 if user not found", async () => {
        vi.mocked(getUserProfile).mockRejectedValueOnce(new AppError(Errors.USER_NOT_FOUND));

        const res = await getProfile(makeProfileRequest("user1"), makeParams("user1"));
        const body = await res.json();

        expect(res.status).toBe(404);
        expect(body.code).toBe("USER_NOT_FOUND");
    });

    it("returns 500 if service throws unexpectedly", async () => {
        vi.mocked(getUserProfile).mockRejectedValueOnce(new Error("db exploded"));
        const res = await getProfile(makeProfileRequest("user1"), makeParams("user1"));
        expect(res.status).toBe(500);
    });
});

describe("GET /api/users/[username]/history", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns 200 with history data", async () => {
        vi.mocked(getUserHistory).mockResolvedValueOnce([
            { change: 100, reason: "DAILY", created_at: "2024-01-01" },
        ]);

        const res = await getHistory(makeHistoryRequest("user1"), makeParams("user1"));
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.data).toHaveLength(1);
    });

    it("returns 200 with custom limit", async () => {
        vi.mocked(getUserHistory).mockResolvedValueOnce([]);

        const res = await getHistory(makeHistoryRequest("user1", { limit: "50" }), makeParams("user1"));
        expect(res.status).toBe(200);
    });

    it("returns 404 if user not found", async () => {
        vi.mocked(getUserHistory).mockRejectedValueOnce(new AppError(Errors.USER_NOT_FOUND));

        const res = await getHistory(makeHistoryRequest("user1"), makeParams("user1"));
        const body = await res.json();

        expect(res.status).toBe(404);
        expect(body.code).toBe("USER_NOT_FOUND");
    });

    it("returns 500 if service throws unexpectedly", async () => {
        vi.mocked(getUserHistory).mockRejectedValueOnce(new Error("db exploded"));
        const res = await getHistory(makeHistoryRequest("user1"), makeParams("user1"));
        expect(res.status).toBe(500);
    });
});