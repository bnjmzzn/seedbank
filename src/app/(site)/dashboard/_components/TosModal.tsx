"use client";

interface Props {
    text: string;
    onAccept: () => void;
}

export default function TosModal({ text, onAccept }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="rounded-xl border-4 border-border bg-card p-6 space-y-4 w-full max-w-md">
                <h2 className="text-lg font-semibold text-foreground">Terms of Service</h2>
                <div className="h-64 overflow-y-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground whitespace-pre-wrap">
                    {text}
                </div>
                <button
                    className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                    onClick={onAccept}
                >
                    I Accept
                </button>
            </div>
        </div>
    );
}