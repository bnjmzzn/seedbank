const TOKEN_KEY = "token";

export interface DecodedToken {
    id: string;
    username: string;
    exp: number;
}

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
}

export function decodeToken(token: string): DecodedToken | null {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        return decoded as DecodedToken;
    } catch {
        return null;
    }
}

export function isTokenValid(): boolean {
    const token = getToken();
    if (!token) return false;

    const decoded = decodeToken(token);
    if (!decoded) return false;

    return decoded.exp * 1000 > Date.now();
}

export function clearAllAppData(): void {
    if (typeof window === "undefined") return;
    localStorage.clear();
}