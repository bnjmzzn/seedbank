import type { Metadata } from "next";
import { Geist } from "next/font/google";
import ThemeProvider from "@/components/providers/ThemeProvider";
import SnackBar from "@/components/shared/SnackBar";

const geist = Geist({ subsets: ["latin"] });

const siteConfig = {
    title: "SeedBank",
    description: "Gambling Simulator 🤑",
    banner: "/images/banner.png",
};

export const metadata: Metadata = {
    title: siteConfig.title,
    description: siteConfig.description,
    icons: {
        icon: "/icon.svg",
    },
    openGraph: {
        title: siteConfig.title,
        description: siteConfig.description,
        images: [{ url: siteConfig.banner }],
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.title,
        description: siteConfig.description,
        images: [siteConfig.banner],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={geist.className}>
            <body>
                <ThemeProvider>
                    {children}
                    <SnackBar />
                </ThemeProvider>
            </body>
        </html>
    );
}