"use client";

import Link from "next/link";
import { Box, Stack, Typography, Button } from "@mui/material";
import Iconify from "@/components/shared/generic/Iconify";

export default function NotFound() {
    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                px: 4,
            }}
        >
            <Stack spacing={4} alignItems="center" textAlign="center">
                <Stack spacing={1} alignItems="center">
                    <Typography
                        sx={{
                            fontSize: { xs: 96, sm: 140, md: 180 },
                            fontWeight: 800,
                            lineHeight: 1,
                            letterSpacing: "0.02em",
                            color: "transparent",
                            WebkitTextStroke: (theme) => `2px ${theme.palette.primary.main}`,
                        }}
                    >
                        404
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: { xs: 18, sm: 24 },
                            fontWeight: 700,
                            letterSpacing: { xs: 4, sm: 8 },
                        }}
                    >
                        PAGE NOT FOUND
                    </Typography>
                </Stack>

                <Button
                    component={Link}
                    href="/"
                    variant="outlined"
                    size="large"
                    startIcon={<Iconify icon="mdi:home-outline" />}
                    sx={{ borderRadius: 1, px: 4 }}
                >
                    Homepage
                </Button>
            </Stack>
        </Box>
    );
}