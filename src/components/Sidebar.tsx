"use client";

import { FolderClock, Settings, Zap } from "lucide-react";
import { Button, buttonSizes } from "./ui/Button";
import { useSearchParams } from "next/navigation";
import { Footer } from "./Footer";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Sidebar(props: React.HTMLAttributes<HTMLDivElement>) {
    const searchParams = useSearchParams();

    const [userSessionId, setUserSessionId] = useState<string | null>(searchParams.get("sessionId"));

    return (
        <div className={cn("flex w-[30%] flex-col bg-black/10 px-4 pt-6 dark:bg-black/25", props.className)}>
            {/* Container */}
            <div className="flex h-full flex-1 flex-col gap-6">
                {/* Profile & Logo Group */}
                <div className="flex w-full items-center gap-4 px-8 py-4">
                    {/* User Avatar */}
                    <a
                        href={`/profile${userSessionId ? `?sessionId=${userSessionId}` : ""}`}
                        className="size-9 transition-opacity duration-200 hover:opacity-75"
                    >
                        <img
                            src="https://api.dicebear.com/9.x/initials/svg?seed=Brooklynn&scale=80"
                            alt="avatar"
                            className="rounded-full"
                        />
                    </a>

                    {/* Logo */}
                    <a
                        href={`/${userSessionId ? `?sessionId=${userSessionId}` : ""}`}
                        className="cursor-pointer text-2xl font-medium transition-opacity duration-200 select-none hover:text-[var(--color-foreground)]/75"
                    >
                        AdVerb
                    </a>
                </div>

                {/* Navigation */}
                <nav>
                    <ul>
                        <li>
                            <Button variant="invisible" className="w-full justify-start p-0">
                                <a
                                    href={`/${userSessionId ? `?sessionId=${userSessionId}` : ""}`}
                                    className={cn(buttonSizes.md, "flex h-full w-full items-center gap-2 py-5")}
                                >
                                    <Zap /> Optimize
                                </a>
                            </Button>
                        </li>
                        <li>
                            <Button variant="invisible" className="w-full justify-start p-0">
                                <a
                                    href={`/history${userSessionId ? `?sessionId=${userSessionId}` : ""}`}
                                    className={cn(buttonSizes.md, "flex h-full w-full items-center gap-2 py-5")}
                                >
                                    <FolderClock /> History
                                </a>
                            </Button>
                        </li>
                        <li>
                            <Button variant="invisible" className="w-full justify-start p-0">
                                <a
                                    href={`/settings${userSessionId ? `?sessionId=${userSessionId}` : ""}`}
                                    className={cn(buttonSizes.md, "flex h-full w-full items-center gap-2 py-5")}
                                >
                                    <Settings /> Settings
                                </a>
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>

            <Footer className="px-0" />
        </div>
    );
}
