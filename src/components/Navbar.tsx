"use client";

import { SessionAvatarAPIResponse } from "@/types/Sessions";

import { FolderClock, Settings, User, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button, buttonSizes } from "./ui/Button";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar(props: React.HtmlHTMLAttributes<HTMLElement>) {
    const searchParams = useSearchParams();

    const [userSessionId, setUserSessionId] = useState<string | null>(searchParams.get("sessionId"));
    const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const profileButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!userSessionId) return;

        const fetchSessionData = async () => {
            const { error, avatarUrl }: SessionAvatarAPIResponse = await fetch(
                `/api/sessions/${userSessionId}?type=avatar`,
                { method: "GET", headers: { "Content-Type": "application/json" } }
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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                profileButtonRef.current &&
                !profileButtonRef.current.contains(e.target as Node)
            ) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative">
            <nav {...props} className={cn("flex w-full items-center justify-between gap-4 px-8 py-4", props.className)}>
                <a
                    href="/"
                    className="cursor-pointer text-2xl font-medium transition-opacity duration-200 select-none hover:text-[var(--color-foreground)]/75"
                >
                    AdVerb
                </a>

                <div className="relative z-50">
                    <button
                        ref={profileButtonRef}
                        className="size-10 cursor-pointer transition-opacity duration-200 hover:opacity-75"
                        onClick={() => setProfileDropdownOpen(prev => !prev)}
                    >
                        {userAvatarUrl ? (
                            <img src={userAvatarUrl} alt="avatar" className="rounded-full" />
                        ) : (
                            <img src="/avatar.svg" alt="avatar" className="rounded-full" />
                        )}
                    </button>

                    {profileDropdownOpen && (
                        <div
                            ref={menuRef}
                            className="dropdown absolute top-full right-0 z-20 w-[40vw] touch-none rounded-lg border border-[var(--color-foreground)]/10 bg-[var(--color-background)] shadow-md dark:border-[var(--color-foreground)]/30"
                        >
                            <Button
                                variant="invisible"
                                className="w-full justify-start p-0"
                                onClick={() => setProfileDropdownOpen(false)}
                            >
                                <a
                                    href={`/profile${userSessionId ? `?sessionId=${userSessionId}` : ""}`}
                                    className={cn(buttonSizes.md, "flex h-full w-full items-center gap-2 py-4")}
                                >
                                    <User size={18} /> Profile
                                </a>
                            </Button>
                            <Button
                                variant="invisible"
                                className="w-full justify-start p-0"
                                onClick={() => setProfileDropdownOpen(false)}
                            >
                                <a
                                    href={`/${userSessionId ? `?sessionId=${userSessionId}` : ""}`}
                                    className={cn(buttonSizes.md, "flex h-full w-full items-center gap-2 py-4")}
                                >
                                    <Zap size={18} /> Optimize
                                </a>
                            </Button>
                            <Button
                                variant="invisible"
                                className="w-full justify-start p-0"
                                onClick={() => setProfileDropdownOpen(false)}
                            >
                                <a
                                    href={`/history${userSessionId ? `?sessionId=${userSessionId}` : ""}`}
                                    className={cn(buttonSizes.md, "flex h-full w-full items-center gap-2 py-4")}
                                >
                                    <FolderClock size={18} /> History
                                </a>
                            </Button>
                            <Button
                                variant="invisible"
                                className="w-full justify-start p-0"
                                onClick={() => setProfileDropdownOpen(false)}
                            >
                                <a
                                    href={`/settings${userSessionId ? `?sessionId=${userSessionId}` : ""}`}
                                    className={cn(buttonSizes.md, "flex h-full w-full items-center gap-2 py-4")}
                                >
                                    <Settings size={18} /> Settings
                                </a>
                            </Button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Backdrop - Menu Open */}
            <div
                className={`${profileDropdownOpen ? "fixed" : "hidden"} fadeIn top-0 left-0 z-10 h-screen w-screen bg-black/15`}
            />
        </div>
    );
}
