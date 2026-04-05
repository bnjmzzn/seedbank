"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs, Typography } from "@mui/material";

export default function Breadcrumb() {
    const pathname = usePathname();
    const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((seg, i, arr) => ({
        label: seg,
        href: "/" + arr.slice(0, i + 1).join("/"),
        isLast: i === arr.length - 1,
    }));

    return (
        <Breadcrumbs aria-label="breadcrumb">
            <Typography color="primary" fontFamily="monospace" fontWeight={700}>
                seedbank
            </Typography>
            {crumbs.map((crumb) => (
                <Typography
                    key={crumb.href}
                    fontFamily="monospace"
                    color={crumb.isLast ? "text.primary" : "text.secondary"}
                    fontWeight={700}
                >
                    {crumb.label}
                </Typography>
            ))}
        </Breadcrumbs>
    );
}