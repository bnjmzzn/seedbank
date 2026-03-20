import { playGame } from "@/lib/services/game";
import { successResponse } from "@/lib/api/response";
import { AppError, Errors, handleApiError } from "@/lib/error";
import { HistoryReason } from "@/types/database";

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

        const userId = request.headers.get("x-user-id")!;
        const result = await playGame(userId, body.game as HistoryReason.Game, body.bet);
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}