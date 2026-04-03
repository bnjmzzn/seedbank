"use client";

import { useState } from "react";
import { Tabs, Tab, Box, Typography, Stack } from "@mui/material";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function Card() {
    const [tab, setTab] = useState(0);

    return (
        <Stack spacing={3} sx={{ width: { xs: "100%", md: "400px" } }}>
            <Box>
                <Typography variant="h5" fontWeight="bold" color="primary">
                    SeedBank
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Sign in to your account or create a new one.
                </Typography>
            </Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
                <Tab label="Login" />
                <Tab label="Sign Up" />
            </Tabs>
            <Box sx={{ overflow: "hidden", width: "100%" }}>
                <Box
                    sx={{
                        display: "flex",
                        width: "200%",
                        transform: tab === 0 ? "translateX(0)" : "translateX(-50%)",
                        transition: "transform   0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        py: 1
                    }}
                >
                    <Box sx={{ width: "50%", pr: 1 }}>
                        <LoginForm />
                    </Box>
                    <Box sx={{ width: "50%", pl: 1 }}>
                        <RegisterForm />
                    </Box>
                </Box>
            </Box>
        </Stack>
    );
}