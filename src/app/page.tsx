"use client";

import { ArrowLeft, ArrowRight, BookmarkPlus, Copy, Dices, SendHorizonal } from "lucide-react";
import { StringSelectMenu } from "@/components/ui/StringSelectMenu";
import { TextInputArea } from "@/components/ui/TextInputArea";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { tones, ToneType } from "@/lib/tones";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [userSessionId, setUserSessionId] = useState<string | null>(null);

    const [userPrompt, setUserPrompt] = useState("");
    const [optimizedSuggestion, setOptimizedSuggestion] = useState("");
    const [tone, setTone] = useState<ToneType>("professional");

    const [versionHistory, setVersionHistory] = useState<[string, string][]>([]);
    const [activeHistoryIndex, setActiveHistoryIndex] = useState(0);

    /* Disablable states */
    const [isAwaitingSessionFetch, setIsAwaitingSessionFetch] = useState(false);
    const [isAwaitingOptimize, setIsAwaitingOptimize] = useState(false);

    const [isCreatingUserSession, setIsCreatingUserSession] = useState(false);
    const [isCopyingToClipboard, setIsCopyingToClipboard] = useState(false);

    useEffect(() => {
        const currentVersion = versionHistory[activeHistoryIndex];
        if (!currentVersion) return;

        setUserPrompt(currentVersion?.[0] || "");
        setOptimizedSuggestion(currentVersion?.[1] || "");
    }, [activeHistoryIndex]);

    useEffect(() => {
        const fetchSessionData = async () => {
            if (!searchParams.get("sessionId")) return;
            setIsAwaitingSessionFetch(true);

            const res = await fetch(`/api/session/${searchParams.get("sessionId")}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            const { error, userPrompts, optimizedSuggestions } = (await res.json()) as {
                error?: string;
                userPrompts?: { text: string }[];
                optimizedSuggestions?: { text: string }[];
            };

            if (error) {
                console.log(error);
                setIsAwaitingSessionFetch(false);
                return router.push("/");
            }

            setUserSessionId(searchParams.get("sessionId"));

            if (userPrompts?.length && optimizedSuggestions?.length) {
                const _history: Array<[string, string]> = userPrompts.map((userPrompt, i) => [
                    userPrompt.text,
                    optimizedSuggestions[i].text
                ]);

                if (_history.length) {
                    setVersionHistory(_history);
                    setActiveHistoryIndex(_history.length - 1);
                }
            }
            setIsAwaitingSessionFetch(false);
        };
        fetchSessionData();
    }, []);

    const createUserSession = async () => {
        setIsCreatingUserSession(true);

        const res = await fetch("/api/create-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const { sessionId } = (await res.json()) as { sessionId: string };
        router.push(`/?sessionId=${sessionId}`);
        setUserSessionId(sessionId);
        setIsCreatingUserSession(false);
    };

    const getOptimizedSuggestion = async () => {
        /* TODO: Send a toast notification instead. */
        if (!userPrompt) {
            alert("Please enter a prompt!");
            return;
        }

        setIsAwaitingOptimize(true);

        const res = await fetch(`/api/optimize/${tone}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: userPrompt, sessionId: userSessionId })
        });

        const { error, optimized } = (await res.json()) as { error?: string; optimized?: string };

        setIsAwaitingOptimize(false);

        if (error) {
            /* TODO: Send a toast notification instead. */
            alert(error);
        }

        if (optimized) {
            setVersionHistory(prev => [...prev, [userPrompt, optimized || ""]]);
            setActiveHistoryIndex(versionHistory.length - 0);
        }
    };

    return (
        <main className="flex w-full flex-col items-center gap-12 px-6">
            {/* Hero */}
            <section id="hero" className="flex w-full max-w-[700px] flex-col gap-12">
                <div className="flex flex-col gap-1 md:hidden">
                    <h1 className="text-5xl">Write ads</h1>
                    <h1 className="text-5xl">that convert</h1>
                </div>

                <div className="hidden md:block">
                    <h1 className="text-center text-5xl">Write ads, that convert</h1>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="relative w-full">
                        <TextInputArea
                            name="user-prompt"
                            placeholder="⚡ Put your ad here..."
                            value={userPrompt}
                            disabled={isAwaitingSessionFetch || isAwaitingOptimize}
                            className={`w-full ${userPrompt.length ? (userPrompt.length > 250 ? "h-50" : "h-30") : "h-15"}`}
                            maxLength={300}
                            onChange={e => setUserPrompt(e.target.value)}
                        />

                        {/* Character count and limit */}
                        <div className="absolute right-0 bottom-[0.70px] rounded-tl-lg rounded-br-lg border border-[var(--color-button-border)]/25 bg-[var(--color-background)] px-2">
                            <span className="text-sm opacity-50 dark:opacity-25">{userPrompt.length}/300</span>
                        </div>
                    </div>

                    {/* CTA - Get Started */}
                    <Button
                        variant={!userPrompt ? "outline" : "primary"}
                        size="md"
                        className={`w-full ${userSessionId ? "hidden" : ""}`}
                        disabled={isCreatingUserSession || !userPrompt.length}
                        onClick={() => createUserSession()}
                    >
                        Get Started with AdVerb
                    </Button>
                </div>
            </section>

            {/* Tone Select */}
            <section
                id="tone"
                className={`flex w-full max-w-[700px] flex-col gap-12 ${!userSessionId ? "hidden" : ""} sectionFadeIn`}
            >
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl">Step 2</h2>

                    <label htmlFor="tone-select">Choose the tone you're going for</label>
                    <StringSelectMenu
                        id="tone-select"
                        options={Object.entries(tones).map(([k, v]) => ({ id: k, label: v.name }))}
                        direction="top"
                        disabled={isAwaitingOptimize}
                        className="w-full"
                        variant="outline"
                        onOptionSelect={option => setTone(option.id as ToneType)}
                    />
                </div>
            </section>

            {/* Suggestions */}
            <section
                id="suggestion"
                className={`flex w-full max-w-[700px] flex-col gap-12 ${!userSessionId ? "hidden" : ""} sectionFadeIn`}
                style={{ animationDelay: "0.2s" }}
            >
                <div className="flex w-full max-w-[700px] flex-col gap-4">
                    <h2 className="text-2xl">Step 3</h2>

                    <div className="flex items-center justify-between gap-4">
                        <label htmlFor="optimized-suggestion">Check out your optimized ad!</label>

                        {/* prettier-ignore */}
                        <Button
                            variant="primary"
                            size="sm"
                            disabled={isAwaitingOptimize}
                            onClick={() => getOptimizedSuggestion()}
                        >
                            {userPrompt === versionHistory[activeHistoryIndex]?.[0] ? <Dices size={18} /> : ""}
                            {userPrompt === versionHistory[activeHistoryIndex]?.[0] ? "Reroll" : "Optimize"}
                            {userPrompt === versionHistory[activeHistoryIndex]?.[0] ? "" : <SendHorizonal size={18} />}
                        </Button>
                    </div>

                    <div className="">
                        <TextInputArea
                            name="optimized-suggestion"
                            value={optimizedSuggestion}
                            readOnly
                            placeholder={isAwaitingOptimize ? "Optimizing..." : "There seems to be nothing... Yet!"}
                            disabled={isAwaitingOptimize}
                            className={`w-full rounded-b-none ${versionHistory[activeHistoryIndex]?.[1].length ? (versionHistory[activeHistoryIndex][1].length > 250 ? "h-50" : "h-30") : "h-15"} cursor-default`}
                        />

                        <div className="flex w-full items-center justify-between rounded-b-lg border border-t-0 border-[var(--color-foreground)]/60 bg-[var(--color-background)] dark:border-[var(--color-foreground)]/15">
                            {/* History Navigation */}
                            <div className="flex">
                                <Button
                                    variant="invisible"
                                    size="square"
                                    disabled={
                                        isAwaitingOptimize ||
                                        !versionHistory[activeHistoryIndex] ||
                                        !versionHistory[activeHistoryIndex - 1]
                                    }
                                    className="rounded-none rounded-bl-lg px-6"
                                    onClick={() => setActiveHistoryIndex(prev => prev - 1)}
                                >
                                    <ArrowLeft size={20} />
                                </Button>

                                <Button
                                    variant="invisible"
                                    size="square"
                                    disabled={
                                        isAwaitingOptimize ||
                                        !versionHistory[activeHistoryIndex] ||
                                        !versionHistory[activeHistoryIndex + 1]
                                    }
                                    className="rounded-none px-6"
                                    onClick={() => setActiveHistoryIndex(prev => prev + 1)}
                                >
                                    <ArrowRight size={20} />
                                </Button>
                            </div>

                            {/* Options */}
                            <div className="flex">
                                <Button
                                    variant="invisible"
                                    size="square"
                                    disabled={isAwaitingOptimize || !versionHistory[activeHistoryIndex]?.[1]}
                                    className="rounded-none px-6"
                                >
                                    <BookmarkPlus size={20} />
                                </Button>

                                <Button
                                    variant="invisible"
                                    size="square"
                                    disabled={
                                        isAwaitingOptimize ||
                                        !versionHistory[activeHistoryIndex]?.[1] ||
                                        isCopyingToClipboard
                                    }
                                    className="rounded-none rounded-br-lg px-6"
                                    onClick={async () => {
                                        setIsCopyingToClipboard(true);
                                        await navigator.clipboard.writeText(versionHistory[activeHistoryIndex][1]);
                                        setIsCopyingToClipboard(false);
                                    }}
                                >
                                    <Copy size={20} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
