import { Box } from "@mui/material";
import Breadcrumb from "@/components/shared/BreadCrumb";

export default function MainHeader() {
    return (
        <Box sx={{ px: 4, py: 2 }}>
            <Breadcrumb />
        </Box>
    );
}