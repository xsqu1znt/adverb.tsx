"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar(props: React.HtmlHTMLAttributes<HTMLElement>) {
    const searchParams = useSearchParams();

    const [userSessionId, setUserSessionId] = useState<string | null>(searchParams.get("sessionId"));

    return (
        <nav {...props} className={cn("flex w-full items-center justify-between gap-4 px-8 py-4", props.className)}>
            <a
                href={`/${userSessionId ? `?sessionId=${userSessionId}` : ""}`}
                className="cursor-pointer text-2xl font-medium transition-opacity duration-200 select-none hover:text-[var(--color-foreground)]/75"
            >
                AdVerb
            </a>

            <a
                href={`/profile${userSessionId ? `?sessionId=${userSessionId}` : ""}`}
                className="size-10 transition-opacity duration-200 hover:opacity-75"
            >
                <img
                    src="https://api.dicebear.com/9.x/initials/svg?seed=Brooklynn&scale=80"
                    alt="avatar"
                    className="rounded-full"
                />
            </a>
        </nav>
    );
}
