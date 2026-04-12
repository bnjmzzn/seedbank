import { playGame } from "@/lib/server/services/game";
import { successResponse } from "@/lib/server/api/response";
import { AppError, Errors, handleApiError } from "@/lib/server/error";
import { HistoryReason } from "@/types/models";

export async function POST(request: Request) {
    try {
        let body: { game: string; bet: number };
        try {
            body = await request.json();
            if (!body.game || !body.bet) throw new Error();
            if (!Number.isInteger(body.bet)) throw new Error();
            if (!(Object.values(HistoryReason.Game) as string[]).includes(body.game)) throw new Error();
        } catch {
            throw new AppError(Errors.INVALID_BODY);
        }

        const userId = request.headers.get("x-user-id");
        if (!userId) throw new AppError(Errors.UNAUTHORIZED);

        const result = await playGame(userId, body.game as HistoryReason.Game, body.bet);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}