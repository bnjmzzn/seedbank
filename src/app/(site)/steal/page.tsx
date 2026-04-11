"use client";

import { Box, Typography } from "@mui/material";

export default function StealPage() {
    return (
        <Box sx={{ p: 1, display: "flex", flexWrap: "wrap", gap: 1, alignItems: "stretch" }}>

            <Box sx={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", p: 2, display: "flex", alignItems: "center", justifyContent: "center", height: 80 }}>
                    <Typography variant="body2" color="text.secondary">Your balance</Typography>
                </Box>
                <Box sx={{ bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">Target username input</Typography>
                    <Typography variant="body2" color="text.secondary">Amount input</Typography>
                    <Typography variant="body2" color="text.secondary">Steal button</Typography>
                </Box>
            </Box>

            <Box sx={{ flex: 2, minWidth: 280, bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", p: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="body2" color="text.secondary">Steal history list</Typography>
            </Box>

        </Box>
    );
}