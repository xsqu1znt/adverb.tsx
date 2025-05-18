"use client";

import { useSearchParams } from "next/navigation";
import { Settings, Share } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
    const searchParams = useSearchParams();
    const [userSessionId, setUserSessionId] = useState<string | null>(searchParams.get("sessionId"));

    useEffect(() => {
        setUserSessionId(searchParams.get("sessionId"));
    }, [searchParams.get("sessionId")]);

    return (
        <main className="flex w-full flex-col items-center gap-12 px-6">
            {/* HEADER */}
            <div className="flex flex-col gap-1">
                <h1 className="flex items-center gap-4 text-5xl">
                    <Settings size={50} /> Settings
                </h1>
            </div>

            {/* NO SETTINGS */}
            <span className="text-md text-center">Settings coming soon!</span>
        </main>
    );
}
