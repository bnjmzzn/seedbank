import { Bean } from "lucide-react";

type LogoVariant = "logo" | "text" | "both";

export default function Logo({
    size = 32,
    variant = "both",
}: {
    size?: number;
    variant?: LogoVariant;
    appName?: string;
}) {
    const showIcon = variant === "logo" || variant === "both";
    const showText = variant === "text" || variant === "both";

    return (
        <div className="flex items-center gap-2">
            {showIcon && (
                <div
                    style={{ width: size, height: size, borderRadius: size * 0.2 }}
                    className="bg-primary flex items-center justify-center shrink-0"
                >
                    <Bean size={size * 0.6} className="text-black" />
                </div>
            )}
            {showText && (
                <span
                    style={{ fontSize: size * 0.6, lineHeight: 1 }}
                    className="font-semibold tracking-tight text-primary"
                >
                    SeedBank
                </span>
            )}
        </div>
    );
}