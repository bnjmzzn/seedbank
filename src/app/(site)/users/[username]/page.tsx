import { Box } from "@mui/material";
import ProfileHeader from "@/components/shared/ProfileHeader";
import HistoryTable from "@/components/shared/HistoryTable";

interface Props {
    params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: Props) {
    const { username } = await params;

    return (
        <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
            <ProfileHeader username={username} />
            <HistoryTable username={username} />
        </Box>
    );
}