"use client";

import { User } from "lucide-react";

export default function ProfilePage() {
    return (
        <main className="flex w-full flex-col items-center gap-12 px-6">
            {/* HEADER */}
            <div className="flex flex-col gap-1">
                <h1 className="flex items-center gap-4 text-5xl">
                    <User size={50} /> Profile
                </h1>
            </div>

            {/* NO PROFILE */}
            <span className="text-md text-center">Profiles coming soon!</span>
        </main>
    );
}
