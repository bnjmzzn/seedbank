"use client";

import { Box, Typography, Button } from "@mui/material";

export default function GamePage() {
    return (
        <Box sx={{ p: 1, display: "flex", flexWrap: "wrap", gap: 1, alignItems: "flex-start" }}>

            <Box sx={{ flex: 2, minWidth: 280, display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body2" color="text.secondary">Visualizer</Typography>
                </Box>
                <Box sx={{ bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", p: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">Choices</Typography>
                </Box>
            </Box>

            <Box sx={{ flex: 1, minWidth: 240, display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", p: 2, display: "flex", alignItems: "center", justifyContent: "center", height: 80 }}>
                    <Typography variant="body2" color="text.secondary">Balance</Typography>
                </Box>
                <Box sx={{ bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">Bet presets (10% / 50% / 100%)</Typography>
                    <Typography variant="body2" color="text.secondary">Bet input</Typography>
                    <Typography variant="body2" color="text.secondary">Lock bet button</Typography>
                </Box>
                <Box sx={{ bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", p: 2, display: "flex", alignItems: "center", justifyContent: "center", height: 80 }}>
                    <Typography variant="body2" color="text.secondary">Result (win / lose + delta)</Typography>
                </Box>
                <Box sx={{ bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", p: 2, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 120 }}>
                    <Typography variant="body2" color="text.secondary">Last results (win/lose dots)</Typography>
                </Box>
            </Box>

        </Box>
    );
}