import { storage } from "./storage";

export function logout() {
    storage.clearAuth();
    window.location.href = "/login";
}