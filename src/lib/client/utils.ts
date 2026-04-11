import { storage } from "./storage";

export function logout() {
    storage.clearAuth();
    window.location.href = "/login";
}

export function getAvatarUrl(username: string | null): string {
    return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=seedbank_${username}`;
}