import { fetchLastDailyClaim } from "@/lib/db/history";
import { updateBalance } from "@/lib/db/user";
import { successResponse, errorResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { DAILY_AMOUNT } from "@/lib/config";
import { HistoryReason } from "@/types/database";

export async function POST(request: Request) {
    try {
        const userId = request.headers.get("x-user-id")!;
        const lastClaim = await fetchLastDailyClaim(userId);

        if (lastClaim) {
            const diff = Date.now() - new Date(lastClaim.created_at).getTime();
            const remaining = 24 * 60 * 60 * 1000 - diff; // milliseconds
        
            if (remaining > 0) {
                return errorResponse("daily reward already claimed", 429, { remaining });
            }
        }

        const updated = await updateBalance(userId, DAILY_AMOUNT, HistoryReason.DAILY);

        return successResponse({
            claimed: DAILY_AMOUNT,
            balance: updated.balance,
        });
    } catch (error) {
        return handleApiError(error);
    }
}