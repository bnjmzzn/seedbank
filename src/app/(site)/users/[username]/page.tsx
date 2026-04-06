import { Box, Divider } from "@mui/material";
import ProfileCard from "./_components/ProfileCard";
import RankBalanceCard from "./_components/RankBalanceCard";
import BalanceLineChart from "./_components/BalanceLineChart";
import ActivityRadarChart from "./_components/ActivityRadarChart";
import EarnedLostCard from "./_components/EarnedLostCard";
import ProfileHistory from "./_components/ProfileHistory";

interface Props {
    params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: Props) {
    const { username } = await params;

    return (
        <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                <ProfileCard username={username} />
                <RankBalanceCard username={username} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                <BalanceLineChart username={username} />
                <ActivityRadarChart username={username} />
            </Box>

            <Divider />

            <EarnedLostCard username={username} />

            <Divider />

            <ProfileHistory username={username} />
        </Box>
    );
}