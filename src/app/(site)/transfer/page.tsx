"use client";

import { useState } from "react";
import TransferForm from "./_components/TransferForm";
import TransferHistory from "./_components/TransferHistory";

export default function TransferPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div className="mx-auto w-full max-w-lg px-6 py-8 space-y-8">
            <TransferForm onSuccess={() => setRefreshKey((k) => k + 1)} />
            <TransferHistory refreshKey={refreshKey} />
        </div>
    );
}