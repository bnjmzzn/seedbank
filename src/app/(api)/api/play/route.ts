import { playGame } from "@/lib/server/services/game";
import { successResponse } from "@/lib/server/api/response";
import { AppError, Errors, handleApiError } from "@/lib/server/error";
import { playBodySchema, parseBody } from "@/lib/server/validation";
import { HistoryReason } from "@/types/models";

export async function POST(request: Request) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) throw new AppError(Errors.UNAUTHORIZED);

        const body = parseBody(playBodySchema, await request.json());
        const result = await playGame(userId, body.game as HistoryReason.Game, body.bet);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}