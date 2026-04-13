import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as login } from "@/app/(api)/api/auth/login/route";
import { POST as register } from "@/app/(api)/api/auth/register/route";

vi.mock("@/lib/server/services/users", () => ({
    loginUser: vi.fn(),
    registerUser: vi.fn(),
    getUserProfile: vi.fn(),
}));

import { loginUser, registerUser } from "@/lib/server/services/users";
import { AppError, Errors } from "@/lib/server/error";

function makeRequest(body: unknown) {
    return new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

const validLogin = { username: "user1", password: "password123" };
const validRegister = { username: "user1", password: "password123" };

describe("POST /api/auth/login", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns 400 if username is missing", async () => {
        const res = await login(makeRequest({ password: "password123" }));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.code).toBe("INVALID_BODY");
        expect(body.data).toHaveProperty("username");
    });

    it("returns 400 if password is missing", async () => {
        const res = await login(makeRequest({ username: "user1" }));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.code).toBe("INVALID_BODY");
        expect(body.data).toHaveProperty("password");
    });

    it("returns 400 if username is too short", async () => {
        const res = await login(makeRequest({ username: "ab", password: "password123" }));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("username");
    });

    it("returns 400 if username has invalid characters", async () => {
        const res = await login(makeRequest({ username: "user1!", password: "password123" }));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("username");
    });

    it("returns 200 on success", async () => {
        vi.mocked(loginUser).mockResolvedValueOnce({
            token: "jwt-token",
            user: { id: "1", username: "user1", balance: 100 },
        });

        const res = await login(makeRequest(validLogin));
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data.token).toBe("jwt-token");
    });

    it("returns 401 if credentials are invalid", async () => {
        vi.mocked(loginUser).mockRejectedValueOnce(new AppError(Errors.INVALID_CREDENTIALS));

        const res = await login(makeRequest(validLogin));
        const body = await res.json();

        expect(res.status).toBe(401);
        expect(body.code).toBe("INVALID_CREDENTIALS");
    });

    it("returns 500 if service throws unexpectedly", async () => {
        vi.mocked(loginUser).mockRejectedValueOnce(new Error("db exploded"));
        const res = await login(makeRequest(validLogin));
        expect(res.status).toBe(500);
    });
});

describe("POST /api/auth/register", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns 400 if username is missing", async () => {
        const res = await register(makeRequest({ password: "password123" }));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.code).toBe("INVALID_BODY");
        expect(body.data).toHaveProperty("username");
    });

    it("returns 400 if password is missing", async () => {
        const res = await register(makeRequest({ username: "user1" }));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.code).toBe("INVALID_BODY");
        expect(body.data).toHaveProperty("password");
    });

    it("returns 400 if username starts with a number", async () => {
        const res = await register(makeRequest({ username: "1user1", password: "password123" }));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("username");
    });

    it("returns 400 if password is too short", async () => {
        const res = await register(makeRequest({ username: "user1", password: "short" }));
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body.data).toHaveProperty("password");
    });

    it("returns 200 on success", async () => {
        vi.mocked(registerUser).mockResolvedValueOnce(undefined);
        const res = await register(makeRequest(validRegister));
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.success).toBe(true);
    });

    it("returns 409 if username is taken", async () => {
        vi.mocked(registerUser).mockRejectedValueOnce(new AppError(Errors.USERNAME_TAKEN));

        const res = await register(makeRequest(validRegister));
        const body = await res.json();

        expect(res.status).toBe(409);
        expect(body.code).toBe("USERNAME_TAKEN");
    });

    it("returns 500 if service throws unexpectedly", async () => {
        vi.mocked(registerUser).mockRejectedValueOnce(new Error("db exploded"));
        const res = await register(makeRequest(validRegister));
        expect(res.status).toBe(500);
    });
});