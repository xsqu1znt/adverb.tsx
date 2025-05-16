"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function History() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [userSessionId, setUserSessionId] = useState<string | null>(searchParams.get("sessionId"));
    const [versionHistory, setVersionHistory] = useState<[string, string][]>([]);

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
                const _history: Array<[string, string]> = userPrompts.map((userPrompt, i) => [
                    userPrompt.text,
                    optimizedSuggestions[i].text
                ]);

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
                <h1 className={`text-5xl ${isLoading && "loadingGlow"}`}>Your history</h1>
            </div>

            {/* CONTAINER OUTER - History */}
            {versionHistory.length && (
                <div className="flex w-full flex-col items-center gap-2">
                    {/* History Blocks */}
                    {versionHistory.map((version, index) => {
                        return (
                            <div className="flex w-full items-center gap-4 bg-white/10 p-4">
                                <span className="text-lg font-bold">{index + 1}</span>
                                <span className="text-lg">{version[0].slice(0, 25)}...</span>
                                <span className="text-lg">{version[1].slice(0, 25)}...</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
