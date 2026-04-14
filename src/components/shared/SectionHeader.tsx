"use client";

import { Box, Typography } from "@mui/material";
import Iconify from "./Iconify";

interface Props {
    icon: string;
    label: string;
}

export default function SectionHeader({ icon, label }: Props) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Iconify icon={icon} sx={{ color: "text.disabled" }} />
            <Typography color="text.secondary">{label}</Typography>
        </Box>
    );
}