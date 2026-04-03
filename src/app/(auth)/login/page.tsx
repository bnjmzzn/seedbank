import { Box } from "@mui/material";
import Card from "./_components/Card";
import Hero from "./_components/Hero";
import WavyBackground from "./_components/WavyBackground";

export default function LoginPage() {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <WavyBackground />
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 4,
                    position: "relative",
                    zIndex: 1,
                }}
                >
                <Card />
            </Box>
            <Box
                sx={{
                    flex: 1,
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    position: "relative",
                    zIndex: 1,
                }}
                >
                <Hero />
            </Box>
        </Box>
    );
}