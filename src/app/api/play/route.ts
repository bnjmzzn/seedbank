import { fetchUser, updateBalance } from "@/lib/db/user";
import { successResponse, errorResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { GUARANTEED_LOSS_BET, WIN_RATE_PERCENT, BET_MIN, GAMES } from "@/lib/config";

function getWinRate(bet: number): number {
    return Math.max(0, (WIN_RATE_PERCENT / 100) * (1 - bet / GUARANTEED_LOSS_BET));
}

export async function POST(request: Request) {
    try {
        let body: { game: string; bet: number };

        try {
            body = await request.json();
            if (!body.game || !body.bet) throw new Error();
            if (!(GAMES as readonly string[]).includes(body.game)) throw new Error();
            if (!Number.isInteger(body.bet) || body.bet < BET_MIN) throw new Error();
        } catch {
            throw new Error("INVALID_BODY");
        }

        const userId = request.headers.get("x-user-id")!;
        const user = await fetchUser("id", userId);

        if (user.balance < body.bet) {
            return errorResponse("insufficient balance", 400);
        }

        const won = Math.random() < getWinRate(body.bet);
        const delta = won ? body.bet : -body.bet;
        const reason = `GAME:${body.game}`;

        const updated = await updateBalance(userId, delta, reason);

        return successResponse({ won, delta, balance: updated.balance });
    } catch (error) {
        return handleApiError(error);
    }
}