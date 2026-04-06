"use client";

import { Box, Typography, Skeleton } from "@mui/material";
import { TrendingUp as EarnedIcon, TrendingDown as LostIcon } from "@mui/icons-material";
import { useHistory } from "@/lib/client/hooks/useHistory";

interface Props {
    username: string;
}

export default function EarnedLostCard({ username }: Props) {
    const { rows, isLoading } = useHistory(username, { limit: 100 });

    const { earned, lost } = rows.reduce(
        (acc, row) => {
            if (row.change > 0) acc.earned += row.change;
            else acc.lost += Math.abs(row.change);
            return acc;
        },
        { earned: 0, lost: 0 }
    );

    return (
        <Box
            sx={{
                borderRadius: 3,
                px: 4,
                py: 3.5,
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    bgcolor: "#1e2e22",
                    borderRadius: 2,
                    px: 3,
                    py: 2.5,
                }}
            >
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: "#2ecc71",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <EarnedIcon sx={{ color: "#121212", fontSize: 24 }} />
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Total Earned
                    </Typography>
                    {isLoading ? (
                        <Skeleton variant="text" width={120} height={36} />
                    ) : (
                        <Typography variant="h6" fontWeight={800} fontFamily="monospace" color="#2ecc71">
                            +{earned.toLocaleString()}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    bgcolor: "#2e1e1e",
                    borderRadius: 2,
                    px: 3,
                    py: 2.5,
                }}
            >
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: "#e74c3c",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <LostIcon sx={{ color: "#121212", fontSize: 24 }} />
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Total Lost
                    </Typography>
                    {isLoading ? (
                        <Skeleton variant="text" width={120} height={36} />
                    ) : (
                        <Typography variant="h6" fontWeight={800} fontFamily="monospace" color="#e74c3c">
                            -{lost.toLocaleString()}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}