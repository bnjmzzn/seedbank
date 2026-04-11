"use client";

import Box from "@mui/material/Box";
import Typography, { type TypographyProps } from "@mui/material/Typography";
import Image from "next/image";
import type { SxProps, Theme } from "@mui/material/styles";

type BrandVariant = "lockup" | "icon" | "text";

interface BrandProps {
    variant?: BrandVariant;
    iconSize?: number;
    textVariant?: TypographyProps["variant"];
    sx?: SxProps<Theme>;
}

export default function Brand({
    variant = "lockup",
    iconSize = 28,
    textVariant = "h6",
    sx,
}: BrandProps) {
    const icon = (
        <Image
            src="/icon.svg"
            alt="Seedbank"
            width={iconSize}
            height={iconSize}
        />
    );

    const text = (
        <Typography variant={textVariant} fontWeight={700} lineHeight={1}>
            SeedBank
        </Typography>
    );

    if (variant === "icon") return icon;
    if (variant === "text") return text;

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ...sx }}>
            {icon}
            {text}
        </Box>
    );
}