import { describe, it, expect } from "vitest";
import { containsProfanity } from "@/lib/server/filter";

describe("containsProfanity", () => {
    it("returns true for a known disallowed word", () => {
        const result = containsProfanity("fock");

        expect(result).toBe(true);
    });

    it("returns false for an ordinary clean username", () => {
        const result = containsProfanity("username1");

        expect(result).toBe(false);
    });
});