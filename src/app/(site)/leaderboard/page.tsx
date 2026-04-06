import { Box } from "@mui/material";
import LeaderboardTable from "./_components/LeaderboardTable";

export default function LeaderboardPage() {
    return (
        <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 720, mx: "auto" }}>
            <LeaderboardTable />
        </Box>
    );
}