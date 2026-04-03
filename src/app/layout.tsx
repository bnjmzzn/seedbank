import type { Metadata } from "next";
import { Geist } from "next/font/google";

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={geist.className}>
            <body>{children}</body>
        </html>
    );
}