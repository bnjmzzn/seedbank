import { getBalanceLeaderboard } from "@/lib/services/leaderboard";
import { successResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/error";

export async function GET() {
    try {
        const result = await getBalanceLeaderboard();
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}