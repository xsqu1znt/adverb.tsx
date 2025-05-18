"use client";

import { SessionAvatarAPIResponse } from "@/types/Sessions";

import { FolderClock, Settings, User, Zap } from "lucide-react";
import { Button, buttonSizes } from "./ui/Button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

export function Sidebar(props: React.HTMLAttributes<HTMLDivElement>) {
    const searchParams = useSearchParams();

    const [userSessionId, setUserSessionId] = useState<string | null>(searchParams.get("sessionId"));
    const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!userSessionId) return;

        const fetchSessionData = async () => {
            const { error, avatarUrl }: SessionAvatarAPIResponse = await fetch(
                `/api/sessions/${userSessionId}?type=avatar`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            ).then(res => res.json());

            if (avatarUrl) {
                setUserAvatarUrl(avatarUrl);
            }

            if (error) {
                console.error(error);
            }
        };

        fetchSessionData();
    }, [userSessionId]);

    useEffect(() => {
        setUserSessionId(searchParams.get("sessionId"));
    }, [searchParams.get("sessionId")]);

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
                        {userAvatarUrl ? (
                            <img src={userAvatarUrl} alt="avatar" className="rounded-full" />
                        ) : (
                            <img src="/avatar.svg" alt="avatar" className="rounded-full" />
                        )}
                    </a>

                    {/* Logo */}
                    <a
                        href="/"
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
