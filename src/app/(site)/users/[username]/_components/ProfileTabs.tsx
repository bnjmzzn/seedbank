"use client";

import { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";

export default function ProfileTabs() {
    const [tab, setTab] = useState(0);

    return (
        <Box sx={{ bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: "1px solid", borderColor: "divider", px: 1 }}>
                <Tab label="Charts" />
                <Tab label="History" />
                <Tab label="Stats" />
            </Tabs>

            <Box sx={{ p: 1 }}>
                {tab === 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <Box sx={{ flex: 1, minWidth: 240, height: 300, border: "1px solid", borderColor: "divider", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography variant="body2" color="text.secondary">Radar, game win counts</Typography>
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 240, height: 300, border: "1px solid", borderColor: "divider", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography variant="body2" color="text.secondary">Radar, most actions (games, transfers, steals, daily)</Typography>
                        </Box>
                    </Box>
                )}

                {tab === 1 && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ height: 200, border: "1px solid", borderColor: "divider", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography variant="body2" color="text.secondary">Balance history graph</Typography>
                        </Box>
                        <Box sx={{ height: 400, border: "1px solid", borderColor: "divider", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography variant="body2" color="text.secondary">Full history table</Typography>
                        </Box>
                    </Box>
                )}

                {tab === 2 && (
                    <Box sx={{ height: 400, border: "1px solid", borderColor: "divider", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="body2" color="text.secondary">Comprehensive stats spreadsheet, games breakdown, transfer totals, steal totals, daily count, net balance change per category</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}