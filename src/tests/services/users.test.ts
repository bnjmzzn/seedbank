import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import {
    registerUser,
    loginUser,
    getUserProfile,
    getMe,
} from "@/lib/server/services/users";
import { dbGetUser, dbInsertUser, dbGetUserRank } from "@/lib/server/db/users";
import { getDailyStatus } from "@/lib/server/services/daily";
import { AppError, Errors } from "@/lib/server/error";
import { containsProfanity } from "@/lib/server/filter";
import { USERNAME_MAX, PASSWORD_MAX } from "@/lib/config";
import { mockUser } from "@/tests/helpers/mocks";

vi.mock("@/lib/server/db/users");
vi.mock("@/lib/server/db/client", () => ({
    supabase: {},
}));
vi.mock("@/lib/server/services/daily");
vi.mock("@/lib/server/filter");
vi.mock("bcryptjs");
vi.mock("jose", () => {
    const signMock = vi.fn().mockResolvedValue("signed-token");
    const setExpirationTimeMock = vi.fn().mockReturnValue({ sign: signMock });
    const setProtectedHeaderMock = vi.fn().mockReturnValue({ setExpirationTime: setExpirationTimeMock });

    return {
        SignJWT: vi.fn().mockImplementation(function () {
            return { setProtectedHeader: setProtectedHeaderMock };
        }),
    };
});
vi.mock("@/lib/server/config", () => ({
    HASH_ROUNDS: 10,
    JWT_SECRET: new Uint8Array(),
    JWT_EXPIRES: "7d",
}));

describe("registerUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("throws INVALID_BODY when the username exceeds the maximum length", async () => {
        const longUsername = "a".repeat(USERNAME_MAX + 1);

        await expect(registerUser(longUsername, "password")).rejects.toThrow(
            new AppError(Errors.INVALID_BODY).code,
        );

        expect(dbInsertUser).not.toHaveBeenCalled();
    });

    it("throws INVALID_BODY when the password exceeds the maximum length", async () => {
        const longPassword = "a".repeat(PASSWORD_MAX + 1);

        await expect(registerUser("username1", longPassword)).rejects.toThrow(
            new AppError(Errors.INVALID_BODY).code,
        );

        expect(dbInsertUser).not.toHaveBeenCalled();
    });

    it("throws INVALID_USERNAME when the username contains profanity", async () => {
        vi.mocked(containsProfanity).mockReturnValue(true);

        await expect(registerUser("username1", "password")).rejects.toThrow(
            new AppError(Errors.INVALID_USERNAME).code,
        );

        expect(dbInsertUser).not.toHaveBeenCalled();
    });

    it("hashes the password and inserts the user", async () => {
        vi.mocked(containsProfanity).mockReturnValue(false);
        vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);
        vi.mocked(dbInsertUser).mockResolvedValue(mockUser(1));

        await registerUser("username1", "password");

        expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
        expect(dbInsertUser).toHaveBeenCalledWith("username1", "hashed-password");
    });
});

describe("loginUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("throws INVALID_CREDENTIALS when the user does not exist", async () => {
        vi.mocked(dbGetUser).mockRejectedValue(new AppError(Errors.USER_NOT_FOUND));

        await expect(loginUser("username1", "password")).rejects.toThrow(
            new AppError(Errors.INVALID_CREDENTIALS).code,
        );
    });

    it("rethrows unrelated errors from the user lookup", async () => {
        const unrelated = new Error("connection lost");
        vi.mocked(dbGetUser).mockRejectedValue(unrelated);

        await expect(loginUser("username1", "password")).rejects.toThrow("connection lost");
    });

    it("throws INVALID_CREDENTIALS when the password does not match", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1, { password: "hashed-password" }));
        vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

        await expect(loginUser("username1", "wrong-password")).rejects.toThrow(
            new AppError(Errors.INVALID_CREDENTIALS).code,
        );
    });

    it("returns a signed token and the user without the password field", async () => {
        const user = mockUser(1, { password: "hashed-password" });
        vi.mocked(dbGetUser).mockResolvedValue(user);
        vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

        const result = await loginUser("username1", "password");

        expect(result.token).toBe("signed-token");
        expect(result.user).not.toHaveProperty("password");
        expect(result.user.username).toBe("username1");
        expect(SignJWT).toHaveBeenCalledWith({ id: "user-1", username: "username1" });
    });
});

describe("getUserProfile", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns the profile combined with rank", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1, { balance: 750 }));
        vi.mocked(dbGetUserRank).mockResolvedValue(3);

        const result = await getUserProfile("username1");

        expect(result).toEqual({
            username: "username1",
            balance: 750,
            rank: 3,
            created_at: "2026-01-01T00:00:00.000Z",
        });
        expect(dbGetUserRank).toHaveBeenCalledWith(750);
    });

    it("defaults balance to zero when missing for rank lookup", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1, { balance: undefined }));
        vi.mocked(dbGetUserRank).mockResolvedValue(1);

        await getUserProfile("username1");

        expect(dbGetUserRank).toHaveBeenCalledWith(0);
    });
});

describe("getMe", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("throws UNAUTHORIZED when the user cannot be found", async () => {
        vi.mocked(dbGetUser).mockRejectedValue(new AppError(Errors.USER_NOT_FOUND));

        await expect(getMe("user-1")).rejects.toThrow(new AppError(Errors.UNAUTHORIZED).code);
    });

    it("rethrows unrelated errors from the user lookup", async () => {
        const unrelated = new Error("connection lost");
        vi.mocked(dbGetUser).mockRejectedValue(unrelated);

        await expect(getMe("user-1")).rejects.toThrow("connection lost");
    });

    it("returns the combined profile with daily status and rank", async () => {
        vi.mocked(dbGetUser).mockResolvedValue(mockUser(1, { balance: 900 }));
        vi.mocked(dbGetUserRank).mockResolvedValue(2);
        vi.mocked(getDailyStatus).mockResolvedValue({ claimable: true, remaining: null });

        const result = await getMe("user-1");

        expect(result).toEqual({
            username: "username1",
            balance: 900,
            rank: 2,
            daily: { claimable: true, remaining: null },
        });
    });
});