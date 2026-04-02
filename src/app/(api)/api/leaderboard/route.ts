import { getBalanceLeaderboard } from "@/lib/server/services/leaderboard";
import { successResponse } from "@/lib/server/api/response";
import { handleApiError } from "@/lib/server/error";

export async function GET() {
    try {
        const result = await getBalanceLeaderboard();
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}