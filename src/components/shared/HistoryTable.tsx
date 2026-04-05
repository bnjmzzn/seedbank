"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Typography,
    Avatar,
    Chip,
    Skeleton,
    Alert,
    Pagination,
} from "@mui/material";
import {
    CardGiftcard as DailyIcon,
    SwapHoriz as TransferIcon,
    SportsEsports as GameIcon,
    AccountBalanceWallet as StealIcon
} from "@mui/icons-material";
import { useHistory } from "@/lib/client/hooks/useHistory";
import { getAvatarUrl } from "@/lib/client/avatar";
import { HistoryReason } from "@/types/database";
import type { HistoryRow } from "@/types/database";

const ROWS_PER_PAGE = 10;

function getReasonIcon(reason: string) {
    if (reason === HistoryReason.DAILY) return <DailyIcon fontSize="medium" />;
    if (reason.startsWith("TRANSFER")) return <TransferIcon fontSize="medium" />;
    if (reason.startsWith("GAME")) return <GameIcon fontSize="medium" />;
    if (reason.startsWith("STEAL")) return <StealIcon fontSize="medium" />;
    return null;
}

function getReasonLabel(reason: string): string {
    const map: Record<string, string> = {
        [HistoryReason.DAILY]: "Claimed daily",
        [HistoryReason.Transfer.SENT]: "Transfer sent to",
        [HistoryReason.Transfer.RECEIVED]: "Transfer received from",
        [HistoryReason.Steal.ROBBER]: "Attempt steal to",
        [HistoryReason.Steal.VICTIM]: "Attempt steal by",
        [HistoryReason.Game.COINFLIP]: "Coinflip",
        [HistoryReason.Game.DICE]: "Dice",
        [HistoryReason.Game.COLOR]: "Color Game",
        [HistoryReason.Game.BOMB]: "Bomb",
        [HistoryReason.Game.RACE]: "Race",
    };
    return map[reason] ?? reason;
}

function formatLocalTime(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}


function PlayerChip({ username }: { username: string }) {
    const router = useRouter();
    return (
        <Chip
            size="small"
            avatar={<Avatar src={getAvatarUrl(username)} />}
            label={`@${username}`}
            onClick={() => router.push(`/users/${username}`)}
            sx={{
                height: 24,
                fontSize: "0.75rem",
                cursor: "pointer",
                bgcolor: "action.selected",
                "& .MuiChip-avatar": { width: 18, height: 18 },
                "&:hover": { bgcolor: "action.focus" },
            }}
        />
    );
}

function HistoryRow({ row }: { row: HistoryRow }) {
    const player = row.meta?.player as string | undefined;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1.5,
                borderRadius: 1,
                bgcolor: "grey.900",
                gap: 2,
                transformOrigin: "center",
                transition: "transform 150ms ease-in-out",
                "&:hover": {
                    transform: "scale(1.01)",
                },
            }}
        >
            <Box sx={{ color: "common.white", flexShrink: 0, display: "flex" }}>
                {getReasonIcon(row.reason)}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={500} noWrap>
                    {getReasonLabel(row.reason)}
                </Typography>
                {player && <PlayerChip username={player} />}
            </Box>
            <Typography
                variant="body2"
                fontWeight={700}
                color={row.change >= 0 ? "success.main" : "error.main"}
                flexShrink={0}
            >
                {row.change >= 0 ? "+" : ""}{row.change.toLocaleString()}
            </Typography>
            <Typography
                variant="caption"
                color="text.secondary"
                flexShrink={0}
                sx={{ minWidth: 90, textAlign: "right" }}
            >
                {row.created_at ? formatLocalTime(row.created_at) : "—"}
            </Typography>
        </Box>
    );
}

function HistoryRowSkeleton() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1.5,
                borderRadius: 2,
                bgcolor: "action.hover",
                gap: 1.5,
            }}
        >
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width={120} sx={{ flex: 1 }} />
            <Skeleton variant="text" width={50} />
            <Skeleton variant="text" width={80} />
        </Box>
    );
}

interface HistoryTableProps {
    username: string;
    type?: string;
    limit?: number;
}

export default function HistoryTable({ username, type, limit }: HistoryTableProps) {
    const { rows, isLoading, error } = useHistory(username, { type, limit });
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(rows.length / ROWS_PER_PAGE);
    const visibleRows = rows.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

    if (error) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                Failed to load history
            </Typography>
        );
    }

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
            {isLoading
                ? Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
                    <HistoryRowSkeleton key={i} />
                ))
                : visibleRows.length === 0
                ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                        No history yet.
                    </Typography>
                )
                : visibleRows.map((row) => (
                    <HistoryRow key={row.id} row={row} />
                ))
            }

            {!isLoading && totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, v) => setPage(v)}
                        size="small"
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
}