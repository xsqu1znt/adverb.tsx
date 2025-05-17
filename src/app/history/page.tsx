"use client";

import { BookmarkPlus, Clock, Copy, Ear, FolderClock, SendHorizonal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { copyToClipboard, eta } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { tones } from "@/constants/tones";

const toneIcons = {
    professional: <tones.professional.icon size={16} style={{ color: `rgba(${tones.professional.color})` }} />,
    formal: <tones.formal.icon size={16} style={{ color: `rgba(${tones.formal.color})` }} />,
    playful: <tones.playful.icon size={16} style={{ color: `rgba(${tones.playful.color})` }} />,
    urgent: <tones.urgent.icon size={16} style={{ color: `rgba(${tones.urgent.color})` }} />,
    casual: <tones.casual.icon size={16} style={{ color: `rgba(${tones.casual.color})` }} />,
    witty: <tones.witty.icon size={16} style={{ color: `rgba(${tones.witty.color})` }} />,
    friendly: <tones.friendly.icon size={16} style={{ color: `rgba(${tones.friendly.color})` }} />,
    empathetic: <tones.empathetic.icon size={16} style={{ color: `rgba(${tones.empathetic.color})` }} />,
    bold: <tones.bold.icon size={16} style={{ color: `rgba(${tones.bold.color})` }} />
};

export default function HistoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [userSessionId, setUserSessionId] = useState<string | null>(searchParams.get("sessionId"));
    const [versionHistory, setVersionHistory] = useState<{ prompt: Record<string, any>; suggestion: Record<string, any> }[]>(
        []
    );

    /* Input states */
    const [isLoading, setIsLoading] = useState(true);
    const [isCopyingToClipboard, setIsCopyingToClipboard] = useState(false);

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
                const _history = userPrompts.map((userPrompt, i) => ({
                    prompt: userPrompt,
                    suggestion: optimizedSuggestions[i]
                }));

                if (_history.length) {
                    setVersionHistory(_history);
                }
            }
            setIsLoading(false);
        };
        fetchSessionData();
    }, []);

    const copy = async (text: string) => {
        setIsCopyingToClipboard(true);
        await copyToClipboard(text);
        setIsCopyingToClipboard(false);
    };

    return (
        <main className="flex w-full flex-col items-center gap-12 px-6">
            {/* HEADER */}
            <div className="flex flex-col gap-1">
                <h1 className={`flex items-center gap-4 text-5xl ${isLoading && "loadingGlow"}`}>
                    <FolderClock size={50} /> History
                </h1>
            </div>

            {/* CONTAINER OUTER - History Table */}
            <div className={`flex w-full flex-col gap-2 ${isLoading && "loadingGlow"}`}>
                {/* Categories */}
                <div className="hidden w-full grid-cols-4 items-center gap-4 rounded-lg bg-[var(--color-foreground)]/5 px-6 py-2 font-medium lg:grid">
                    <span className="flex items-center gap-2 opacity-60">
                        <Clock size={18} /> Date
                    </span>
                    <span className="flex items-center gap-2 opacity-60">
                        <Ear size={18} /> Tone
                    </span>
                    <span className="flex items-center gap-2 opacity-60">
                        <SendHorizonal size={18} /> Prompt
                    </span>
                    <span className="flex items-center gap-2 opacity-60">
                        <BookmarkPlus size={18} /> Suggestion
                    </span>
                </div>

                {/* CONTAINER OUTER - History details */}
                <div
                    className={`flex w-full flex-col items-center rounded-lg ${versionHistory.length && "border"} border-[var(--color-foreground)]/20`}
                >
                    {/* Blocks */}
                    {versionHistory.length ? (
                        versionHistory.map(({ prompt, suggestion }, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`fadeSlideDown flex w-full flex-col flex-nowrap gap-4 lg:grid lg:grid-cols-4 lg:items-center ${index !== versionHistory.length - 1 && "border-b"} border-[var(--color-foreground)]/10 px-6 py-4`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Copy & Date (hidden on mobile) */}
                                    <span className="text-md hidden items-center gap-2 opacity-50 lg:flex">
                                        <Button
                                            id="copy-suggestion"
                                            variant="invisible"
                                            size="square"
                                            disabled={isCopyingToClipboard}
                                            className="not-lg:hidden"
                                            onClick={() => copy(suggestion.text)}
                                        >
                                            <Copy size={18} />
                                        </Button>

                                        {eta(new Date(prompt.created_at).getTime())}
                                    </span>

                                    {/* TONE */}
                                    <span
                                        className={`flex w-fit items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-nowrap`}
                                        style={{
                                            backgroundColor: `rgba(${tones[suggestion.tone_used as keyof typeof tones].color}, 0.15)`
                                        }}
                                    >
                                        {toneIcons[suggestion.tone_used as keyof typeof toneIcons]}
                                        {`${suggestion.tone_used[0].toUpperCase()}${suggestion.tone_used.slice(1)}`}
                                    </span>

                                    {/* PROMPT & SUGGESTION */}
                                    <span className="text-md no-scrollbar w-full p-2 not-lg:rounded-md not-lg:bg-[var(--color-foreground)]/5 lg:max-w-50 lg:overflow-x-auto lg:text-nowrap">
                                        {prompt.text}
                                    </span>
                                    <span className="text-md no-scrollbar w-full p-2 not-lg:rounded-md not-lg:bg-[var(--color-foreground)]/5 lg:max-w-50 lg:overflow-x-auto lg:text-nowrap">
                                        {suggestion.text}
                                    </span>

                                    {/* Copy & Date (hidden on desktop) */}
                                    <div className="flex w-full items-center justify-between gap-4 lg:hidden">
                                        <span className="text-md opacity-50 lg:hidden">
                                            {eta(new Date(prompt.created_at).getTime())}
                                        </span>
                                        <Button
                                            id="copy-suggestion"
                                            variant="invisible"
                                            size="square"
                                            disabled={isCopyingToClipboard}
                                            onClick={() => copy(suggestion.text)}
                                        >
                                            <Copy size={20} />
                                            Suggestion
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <span className="text-md text-center">You have no history recorded for this session</span>
                    )}
                </div>
            </div>
        </main>
    );
}
