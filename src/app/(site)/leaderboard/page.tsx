"use client";

import { Box, Typography } from "@mui/material";

export default function LeaderboardPage() {
    return (
        <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Box sx={{ flex: 1, minWidth: 160, height: 80, bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body2" color="text.secondary">Your rank #</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 160, height: 80, bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body2" color="text.secondary">Gap from top 1 / ahead of top 2</Typography>
                </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "flex-start" }}>
                <Box sx={{ flex: 1, minWidth: 200, bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
                    <Typography variant="body2" color="text.secondary">Top 3 podium</Typography>
                </Box>
                <Box sx={{ flex: 2, minWidth: 280, display: "flex", flexDirection: "column", gap: 1 }}>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Box key={i} sx={{ height: 52, bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", px: 2 }}>
                            <Typography variant="body2" color="text.secondary">Player {i + 4}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box sx={{ height: 200, bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="body2" color="text.secondary">Top 10 balance bar chart</Typography>
            </Box>

        </Box>
    );
}