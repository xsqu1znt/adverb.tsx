"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { FolderClock, Settings, User, Zap } from "lucide-react";
import { Button, buttonSizes } from "./ui/Button";

export function Navbar(props: React.HtmlHTMLAttributes<HTMLElement>) {
    const searchParams = useSearchParams();

    const [userSessionId, setUserSessionId] = useState<string | null>(searchParams.get("sessionId"));
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const profileButtonRef = useRef<HTMLButtonElement>(null);

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
                    href={`/${userSessionId ? `?sessionId=${userSessionId}` : ""}`}
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
                        <img
                            src="https://api.dicebear.com/9.x/initials/svg?seed=Brooklynn&scale=80"
                            alt="avatar"
                            className="rounded-full"
                        />
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
