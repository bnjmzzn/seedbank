"use client";

import { useState } from "react";
import StealForm from "./_components/StealForm";
import StealHistory from "./_components/StealHistory";

export default function StealPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div className="mx-auto w-full max-w-lg px-6 py-8 space-y-8">
            <StealForm onSuccess={() => setRefreshKey((k) => k + 1)} />
            <StealHistory refreshKey={refreshKey} />
        </div>
    );
}