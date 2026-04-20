"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, ButtonBase, IconButton, Paper, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HistoryRow } from "@/types/db";
import { HISTORY_META } from "@/lib/client/registry/history";
import { filterHistory } from "@/lib/client/utils";
import Iconify from "./Iconify";

interface HistoryTableProps {
    rows: HistoryRow[];
    type?: string;
    limit?: number;
    maxRowsPerPage?: number;
    isLoading?: boolean;
}

function formatChange(change: number): string {
    return change > 0
        ? `+${change.toLocaleString()}`
        : change.toLocaleString();
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

interface HistoryRowItemProps {
    row: HistoryRow;
    onClick: () => void;
}

function HistoryRowItem({ row, onClick }: HistoryRowItemProps) {
    const theme = useTheme();
    const meta = HISTORY_META[row.reason];
    const { label, icon } = meta ?? { label: row.reason, icon: "mdi:help-circle" };

    const isPositive = row.change > 0;
    const iconBg = isPositive ? theme.palette.success.main : theme.palette.error.main;
    const changeColor = isPositive ? theme.palette.success.light : theme.palette.error.light;
    const changeStr = formatChange(row.change);
    const dateStr = formatDate(row.created_at);

    return (
        <ButtonBase
            onClick={onClick}
            sx={{
                display: "block",
                width: "100%",
                borderRadius: 2,
                "& .row-paper": { transition: "background-color 0.15s ease" },
                "&:hover .row-paper": { bgcolor: "action.hover" },
                "&:active .row-paper": { bgcolor: "action.selected" },
            }}
        >
            <Paper
                className="row-paper"
                elevation={1}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    gap: 2,
                }}
            >
                <Iconify icon={icon} sx={{ color: iconBg, flexShrink: 0, fontSize: 30 }} />

                <Box sx={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <Typography fontWeight={600} noWrap>{label}</Typography>
                    <Typography variant="caption" color="text.secondary">{dateStr}</Typography>
                </Box>

                <Typography
                    fontWeight={600}
                    sx={{ flexShrink: 0, color: changeColor, fontFamily: "monospace"}}
                >
                    {changeStr}
                </Typography>

                <Iconify icon="mdi:chevron-right" sx={{ color: "text.disabled", flexShrink: 0 }} />
            </Paper>
        </ButtonBase>
    );
}

function HistoryRowSkeleton() {
    return (
        <Paper
            elevation={1}
            sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                px: 2,
                py: 1.5,
                gap: 2,
            }}
        >
            <Skeleton variant="circular" width={28} height={28} sx={{ flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="25%" />
            </Box>
            <Skeleton variant="text" width={60} />
            <Skeleton variant="circular" width={20} height={20} sx={{ flexShrink: 0 }} />
        </Paper>
    );
}

interface PaginatorProps {
    page: number;
    pageCount: number;
    onChange: (value: number) => void;
}

function Paginator({ page, pageCount, onChange }: PaginatorProps) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, pt: 1 }}>
            <IconButton onClick={() => onChange(page - 1)} disabled={page <= 1} size="large">
                <Iconify icon="mdi:chevron-left" />
            </IconButton>
            <Typography color="text.secondary">
                <Box component="span" fontWeight={700} color="text.primary">{page}</Box>
                {" / "}
                {pageCount}
            </Typography>
            <IconButton onClick={() => onChange(page + 1)} disabled={page >= pageCount} size="large">
                <Iconify icon="mdi:chevron-right" />
            </IconButton>
        </Box>
    );
}

export default function HistoryTable({ rows, type, limit, maxRowsPerPage = 10, isLoading }: HistoryTableProps) {
    const router = useRouter();
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const result = filterHistory(rows, type);
        return limit ? result.slice(0, limit) : result;
    }, [rows, type, limit]);

    const pageCount = Math.ceil(filtered.length / maxRowsPerPage);
    const paginated = filtered.slice((page - 1) * maxRowsPerPage, page * maxRowsPerPage);
    const isEmpty = !isLoading && filtered.length === 0;

    function handleRowClick(id?: string) {
        if (!id) return;
        router.push(`/history/${id}`);
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {isLoading && (
                Array.from({ length: 5 }).map((_, i) => <HistoryRowSkeleton key={i} />)
            )}
            {isEmpty && (
                <Box sx={{ flex: 1, minHeight: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography color="text.secondary">No history yet.</Typography>
                </Box>
            )}
            {!isLoading && !isEmpty && (
                <>
                    {paginated.map((row, i) => (
                        <HistoryRowItem
                            key={row.id ?? i}
                            row={row}
                            onClick={() => handleRowClick(row.id)}
                        />
                    ))}
                    {pageCount > 1 && (
                        <Paginator page={page} pageCount={pageCount} onChange={setPage} />
                    )}
                </>
            )}
        </Box>
    );
}