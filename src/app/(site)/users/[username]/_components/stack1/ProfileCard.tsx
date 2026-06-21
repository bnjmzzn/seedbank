"use client";

import { Typography } from "@mui/material";

interface ProfileCardProps {
    username?: string;
    createdAt?: string;
}

export default function ProfileCard({ username, createdAt }: ProfileCardProps) {
    return (
        <Typography>
            {username} joined {createdAt}
        </Typography>
    );
}