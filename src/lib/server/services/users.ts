import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { dbGetUser, dbInsertUser, dbGetUserRank } from "@/lib/server/db/users";
import { AppError, Errors } from "@/lib/server/error";
import { HASH_ROUNDS, JWT_SECRET, JWT_EXPIRES } from "@/lib/server/config";
import { USERNAME_MAX, PASSWORD_MAX } from "@/lib/config";
import type { UserRow, UserProfile } from "@/types/database";

export async function registerUser(username: string, password: string): Promise<void> {
    if (username.length > USERNAME_MAX) throw new AppError(Errors.INVALID_BODY);
    if (password.length > PASSWORD_MAX) throw new AppError(Errors.INVALID_BODY);

    const hashedPassword = await bcrypt.hash(password, HASH_ROUNDS);
    await dbInsertUser(username, hashedPassword);
}

export async function loginUser(
    username: string,
    password: string
): Promise<{ token: string; user: Omit<UserRow, "password"> }> {
    
    let user: UserRow;

    try {
        user = await dbGetUser("username", username);
    } catch (error) {
        if (error instanceof AppError && error.code === Errors.USER_NOT_FOUND.code)
            throw new AppError(Errors.INVALID_CREDENTIALS);
        throw error;
    }

    const valid = await bcrypt.compare(password, user.password!);
    if (!valid) throw new AppError(Errors.INVALID_CREDENTIALS);

    const token = await new SignJWT({ id: user.id, username: user.username })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(JWT_EXPIRES)
        .sign(JWT_SECRET);

    const { password: _, ...safeUser } = user;
    return { token, user: safeUser };
}

export async function getUserProfile(username: string): Promise<UserProfile> {
    const user = await dbGetUser("username", username);
    const rank = await dbGetUserRank(user.balance ?? 0);

    return {
        username: user.username,
        balance: user.balance ?? 0,
        rank,
        created_at: user.created_at!,
    };
}