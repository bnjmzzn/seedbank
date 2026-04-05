import { Box } from "@mui/material";
import LeaderboardTable from "./_components/LeaderboardTable";

export default function LeaderboardPage() {
    return (
        <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
            <LeaderboardTable />
        </Box>
    );
}