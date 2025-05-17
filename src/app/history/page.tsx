"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { tones } from "@/constants/tones";
import { eta } from "@/lib/utils";
import { BookmarkPlus, Clock, Dices, Ear, FolderClock, SendHorizonal } from "lucide-react";

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

export default function History() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [userSessionId, setUserSessionId] = useState<string | null>(searchParams.get("sessionId"));
    const [versionHistory, setVersionHistory] = useState<{ prompt: Record<string, any>; suggestion: Record<string, any> }[]>(
        []
    );

    /* Input states */
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <main className="flex w-full flex-col items-center gap-12 px-6">
            {/* HEADER */}
            <div className="flex flex-col gap-1">
                <h1 className={`text-5xl ${isLoading && "loadingGlow"} flex items-center gap-4`}>
                    <FolderClock size={50} /> History
                </h1>
            </div>

            {/* CONTAINER OUTER - History Table */}
            <div className="flex w-full flex-col gap-2">
                {/* Categories */}
                {/* <div className="flex w-full items-center justify-between gap-4 rounded-lg bg-[var(--color-foreground)]/10 px-6 py-2 font-medium"> */}
                <div className="grid w-full grid-cols-4 items-center gap-4 rounded-lg bg-[var(--color-foreground)]/10 px-6 py-2 font-medium">
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
                <div className="flex w-full flex-col items-center rounded-lg border border-[var(--color-foreground)]/10">
                    {/* Blocks */}
                    {versionHistory ? (
                        versionHistory.map(({ prompt, suggestion }, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`grid w-full flex-nowrap items-center gap-4 not-lg:grid-rows-4 lg:grid-cols-4 ${index !== versionHistory.length - 1 && "border-b"} border-[var(--color-foreground)]/10 px-6 py-4`}
                                >
                                    <span className="text-md opacity-50">{eta(new Date(prompt.created_at).getTime())}</span>
                                    <span
                                        className={`flex w-fit items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-nowrap`}
                                        style={{
                                            backgroundColor: `rgba(${tones[suggestion.tone_used as keyof typeof tones].color}, 0.15)`
                                        }}
                                    >
                                        {toneIcons[suggestion.tone_used as keyof typeof toneIcons]}
                                        {`${suggestion.tone_used[0].toUpperCase()}${suggestion.tone_used.slice(1)}`}
                                    </span>
                                    {/* TODO: Fade out the sides and add a copy button */}
                                    <span className="no-scrollbar text-md overflow-x-auto text-nowrap not-lg:w-full lg:max-w-50">
                                        {prompt.text}
                                    </span>
                                    <span className="no-scrollbar text-md overflow-x-auto text-nowrap not-lg:w-full lg:max-w-50">
                                        {suggestion.text}
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <div>You have no history recorded for this session</div>
                    )}
                </div>
            </div>
        </main>
    );
}
