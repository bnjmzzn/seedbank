"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";

type BrandIconProps = {
    size?: number;
};

export function BrandIcon({ size = 28 }: BrandIconProps) {
    return (
        <Box
            sx={{
                width: size,
                height: size,
                borderRadius: `${size * 0.2}px`,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}
        >
            <Image
                src="/icon.svg"
                alt="SeedBank"
                width={size * 0.8}
                height={size * 0.8}
                style={{ filter: "brightness(0)" }}
            />
        </Box>
    );
}

type BrandTextProps = {
    size?: number;
};

export function BrandText({ size = 16 }: BrandTextProps) {
    return (
        <Typography
            fontWeight={700}
            color="text.primary"
            letterSpacing={0.3}
            lineHeight={1}
            fontSize={size}
        >
            SeedBank
        </Typography>
    );
}

type BrandLogoProps = {
    iconSize?: number;
    textSize?: number;
};

export default function BrandLogo({ iconSize = 28, textSize = 16 }: BrandLogoProps) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 1.5, py: 0.5 }}>
            <BrandIcon size={iconSize} />
            <BrandText size={textSize} />
        </Box>
    );
}