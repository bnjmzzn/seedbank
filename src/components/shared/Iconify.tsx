import { Icon } from "@iconify/react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material";

interface Props {
    icon: string;
    sx?: SxProps<Theme>;
    [key: string]: unknown;
}

export default function Iconify({ icon, sx, ...other }: Props) {
    // default fontsize 24
    return <Box component={Icon} icon={icon} sx={{ fontSize: 24, ...sx }} {...other} />;
}