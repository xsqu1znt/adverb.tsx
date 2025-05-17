"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SimpleDropdown } from "./ui/SimpleDropdown";

export function Navbar(props: React.HtmlHTMLAttributes<HTMLElement>) {
    const searchParams = useSearchParams();

    const [userSessionId, setUserSessionId] = useState<string | null>(searchParams.get("sessionId"));
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

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
                setHighlightedIndex(null);
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

                {/* <a
                href={`/profile${userSessionId ? `?sessionId=${userSessionId}` : ""}`}
                className="size-10 transition-opacity duration-200 hover:opacity-75"
            >
                <img
                    src="https://api.dicebear.com/9.x/initials/svg?seed=Brooklynn&scale=80"
                    alt="avatar"
                    className="rounded-full"
                />
            </a> */}

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
                            className="dropdown absolute top-full right-0 z-20 w-40 rounded-lg border border-[var(--color-foreground)]/10 bg-[var(--color-background)] shadow-md dark:border-[var(--color-foreground)]/30"
                        >
                            {[{ label: "Profile" }, { label: "Optimize" }, { label: "History" }, { label: "Sign out" }].map(
                                (option, index) => (
                                    <div
                                        key={index}
                                        role="option"
                                        aria-selected={highlightedIndex === index}
                                        tabIndex={0}
                                        className={`fadeSlideDown flex cursor-pointer gap-2 px-4 py-4 text-lg ${index === highlightedIndex ? "bg-white/15" : ""}`}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                        onClick={() => {
                                            setProfileDropdownOpen(false);
                                        }}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                        onKeyDown={e => {
                                            if (e.key === "Enter" || e.key === "Space") {
                                                setProfileDropdownOpen(false);
                                            }
                                        }}
                                    >
                                        <span>{option.label}</span>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </nav>

            <div
                className={`${profileDropdownOpen ? "absolute" : "hidden"} fadeIn top-0 left-0 z-10 h-screen w-screen bg-black/10 grayscale-100 backdrop-blur-xs`}
            />
        </div>
    );
}
