"use client";

import { ArrowLeft, ArrowRight, BookmarkPlus, Copy, Dices, Ear, SendHorizonal, Zap } from "lucide-react";
import { StringSelectMenu } from "@/components/ui/StringSelectMenu";
import { TextAreaInput } from "@/components/ui/TextAreaInput";
import { tones, ToneType } from "@/constants/tones";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { copyToClipboard } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [userSessionId, setUserSessionId] = useState<string | null>(null);

    const [userPrompt, setUserPrompt] = useState("");
    const [optimizedSuggestion, setOptimizedSuggestion] = useState("");
    const [selectedTone, setSelectedTone] = useState<ToneType>("professional");

    const [versionHistory, setVersionHistory] = useState<[string, string][]>([]);
    const [activeHistoryIndex, setActiveHistoryIndex] = useState(0);

    /* Input states */
    const [isLoading, setIsLoading] = useState(true);

    const [isAwaitingOptimize, setIsAwaitingOptimize] = useState(false);
    const [isCopyingToClipboard, setIsCopyingToClipboard] = useState(false);
    const [isUserPromptDiff, setIsUserPromptDiff] = useState(true);

    useEffect(() => {
        const currentVersion = versionHistory[activeHistoryIndex];
        if (!currentVersion) return;

        setUserPrompt(currentVersion?.[0] || "");
        setOptimizedSuggestion(currentVersion?.[1] || "");
    }, [activeHistoryIndex, versionHistory]);

    useEffect(() => {
        if (!userPrompt) {
            setIsUserPromptDiff(true);
            return;
        }
        setIsUserPromptDiff(userPrompt === versionHistory[activeHistoryIndex]?.[0]);
    }, [userPrompt, optimizedSuggestion, activeHistoryIndex, versionHistory]);

    useEffect(() => {
        const fetchSessionData = async () => {
            if (!searchParams.get("sessionId")) {
                setIsLoading(false);
                return;
            }

            const res = await fetch(`/api/sessions/${searchParams.get("sessionId")}`, {
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
                setIsLoading(false);
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
            setIsLoading(false);
        };
        fetchSessionData();
    }, []);

    const createUserSession = async () => {
        setIsLoading(true);

        const res = await fetch("/api/create-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const { sessionId } = (await res.json()) as { sessionId: string };
        router.push(`/?sessionId=${sessionId}`);
        setUserSessionId(sessionId);
        setIsLoading(false);
    };

    const getOptimizedSuggestion = async () => {
        /* TODO: Send a toast notification instead. */
        if (!userPrompt) {
            alert("Please enter a prompt!");
            return;
        }

        setIsLoading(true);
        setIsAwaitingOptimize(true);

        const res = await fetch(`/api/optimize/${selectedTone}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: userPrompt, sessionId: userSessionId })
        });

        const { error, optimized } = (await res.json()) as { error?: string; optimized?: string };

        setIsLoading(false);
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

    const copy = async (text: string) => {
        setIsCopyingToClipboard(true);
        await copyToClipboard(text);
        setIsCopyingToClipboard(false);
    };

    return (
        <main className="flex w-full flex-col items-center gap-12 px-6">
            {/* SECTION - Hero */}
            <section id="hero" className="flex w-full max-w-[700px] flex-col gap-12">
                {/* HEADER (hidden on desktop) */}
                <div className="flex flex-col gap-1 md:hidden">
                    <h1 className="text-5xl">Write ads</h1>
                    <h1 className="text-5xl">that convert</h1>
                </div>

                {/* HEADER (hidden on mobile) */}
                <div className="hidden md:block">
                    <h1 className="text-center text-5xl">Write ads, that convert</h1>
                </div>

                {/* CTA - Get started */}
                <div className="flex flex-col gap-4">
                    {/* CONTAINER OUTER - User prompt */}
                    <div className="relative w-full">
                        {/* INPUT - User prompt */}
                        <TextAreaInput
                            name="user-prompt"
                            placeholder="⚡ Put your ad here..."
                            value={userPrompt}
                            disabled={isLoading}
                            isLoading={isLoading}
                            className={`w-full ${userPrompt.length ? (userPrompt.length > 250 ? "h-50" : "h-30") : "h-15"}`}
                            maxLength={300}
                            onChange={e => setUserPrompt(e.target.value)}
                        />

                        {/* char count and limit */}
                        <div className="absolute right-0 bottom-0 rounded-tl-lg rounded-br-lg border border-[var(--color-button-border)]/25 bg-[var(--color-background)] px-2">
                            <span className="text-sm opacity-50 dark:opacity-25">{userPrompt.length}/300</span>
                        </div>
                    </div>

                    {/* CTA BUTTON - Get Started */}
                    <Button
                        variant={!userPrompt ? "outline" : "primary"}
                        size="md"
                        disabled={isLoading || !userPrompt.length}
                        isLoading={isLoading}
                        className={`w-full ${userSessionId ? "hidden" : ""}`}
                        onClick={() => createUserSession()}
                    >
                        Get Started with AdVerb
                    </Button>
                </div>
            </section>

            {/* SECTION - Tone Select */}
            <section
                id="tone"
                className={`flex w-full max-w-[700px] flex-col gap-12 ${!userSessionId ? "hidden" : ""} fadeSlideRight`}
            >
                {/* CONTAINER OUTER - Tone Select */}
                <div className="flex flex-col gap-4">
                    {/* HEADER */}
                    <h2 className="text-2xl"> Step 2</h2>

                    {/* CONTAINER INNER - Tone select */}
                    <div className="flex flex-col justify-between gap-4">
                        <label htmlFor="tone-select" className="flex items-center gap-1">
                            <Ear size={18} className="text-gray-500" /> Choose the tone you're going for
                        </label>
                        {/* INPUT - Tone select */}
                        <StringSelectMenu
                            id="tone-select"
                            variant="outline"
                            direction="top"
                            options={Object.entries(tones).map(([k, v]) => ({ id: k, label: v.name }))}
                            disabled={isLoading}
                            isLoading={isLoading}
                            className="w-full"
                            onOptionSelect={option => setSelectedTone(option.id as ToneType)}
                        />
                    </div>
                </div>
            </section>

            {/* SECTION - Optimized Suggestion */}
            <section
                id="suggestion"
                className={`flex w-full max-w-[700px] flex-col gap-12 ${!userSessionId ? "hidden" : ""} fadeSlideRight`}
                style={{ animationDelay: "0.2s" }}
            >
                {/* CONTAINER OUTER - Optimized suggestion */}
                <div className="flex w-full flex-col gap-4">
                    {/* HEADER */}
                    <h2 className="text-2xl">Step 3</h2>

                    {/* CONTAINER INNER - Optimized suggestion */}
                    <div className="flex items-center justify-between gap-4">
                        <label htmlFor="optimized-suggestion" className="flex items-center gap-1">
                            <Zap size={18} className="text-yellow-500" fill="currentColor" /> Check out your optimized ad!
                        </label>

                        {/* CTA BUTTON - Optimize/Reroll */}
                        <Button
                            variant="primary"
                            size="sm"
                            disabled={isLoading}
                            isLoading={isLoading}
                            onClick={() => getOptimizedSuggestion()}
                        >
                            {isUserPromptDiff ? <Dices size={18} /> : ""}
                            {isUserPromptDiff ? "Reroll" : "Optimize"}
                            {isUserPromptDiff ? "" : <SendHorizonal size={18} />}
                        </Button>
                    </div>

                    {/* CONTAINER OUTER - Optimized suggestion - Output */}
                    <div>
                        {/* OUTPUT - Optimized suggestion */}
                        <TextAreaInput
                            readOnly
                            name="optimized-suggestion"
                            value={optimizedSuggestion}
                            placeholder={isAwaitingOptimize ? "Optimizing..." : "There seems to be nothing... Yet!"}
                            disabled={isLoading}
                            isLoading={isLoading}
                            className={`w-full rounded-b-none ${optimizedSuggestion.length ? (optimizedSuggestion.length > 250 ? "h-50" : "h-30") : "h-15"} cursor-default`}
                        />

                        {/* CONTAINER OUTER - Output controls */}
                        <div
                            className={`${isLoading && "loadingGlow"} flex w-full items-center justify-between rounded-b-lg border border-t-0 border-[var(--color-foreground)]/60 bg-[var(--color-background)] dark:border-[var(--color-foreground)]/15`}
                        >
                            {/* CONTAINER - History navigation - Left */}
                            <div className="flex">
                                {/* BUTTON - History back */}
                                <Button
                                    variant="invisible"
                                    size="square"
                                    disabled={
                                        isLoading ||
                                        !versionHistory[activeHistoryIndex] ||
                                        !versionHistory[activeHistoryIndex - 1]
                                    }
                                    isLoading={isLoading}
                                    className="rounded-none rounded-bl-lg px-6"
                                    onClick={() => setActiveHistoryIndex(prev => prev - 1)}
                                >
                                    <ArrowLeft size={20} />
                                </Button>

                                {/* BUTTON - History forward */}
                                <Button
                                    variant="invisible"
                                    size="square"
                                    disabled={
                                        isLoading ||
                                        !versionHistory[activeHistoryIndex] ||
                                        !versionHistory[activeHistoryIndex + 1]
                                    }
                                    isLoading={isLoading}
                                    className="rounded-none px-6"
                                    onClick={() => setActiveHistoryIndex(prev => prev + 1)}
                                >
                                    <ArrowRight size={20} />
                                </Button>
                            </div>

                            {/* CONTAINER - Version options - Right */}
                            <div className="flex">
                                {/* BUTTON - Bookmark suggestion */}
                                <Button
                                    variant="invisible"
                                    size="square"
                                    disabled={isLoading || !versionHistory[activeHistoryIndex]?.[1]}
                                    isLoading={isLoading}
                                    className="rounded-none px-6"
                                >
                                    <BookmarkPlus size={20} />
                                </Button>

                                {/* BUTTON - Copy suggestion */}
                                <Button
                                    variant="invisible"
                                    size="square"
                                    disabled={isLoading || !versionHistory[activeHistoryIndex]?.[1] || isCopyingToClipboard}
                                    isLoading={isLoading}
                                    className="rounded-none rounded-br-lg px-6"
                                    onClick={() => copy(versionHistory[activeHistoryIndex][1])}
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
