"use client";

import { Button } from "@/components/Button";
import { tonePrompts, ToneType } from "./api/optimize/[tone]/route";

import OpenAI from "openai";
import React, { useState } from "react";

const tones = [
    "formal",
    "playful",
    "urgent",
    "professional",
    "casual",
    "witty",
    "friendly",
    "empathetic",
    "bold",
    "default"
];

export default function Home() {
    const [prompt, setPrompt] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [tone, setTone] = useState<ToneType>("urgent");

    const generateSuggestion = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch(`/api/optimize/${tone}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: prompt })
        });

        const { error, suggestion, usage } = (await res.json()) as {
            error?: string;
            suggestion?: string;
            usage?: OpenAI.CompletionUsage;
        };

        if (error) {
            setSuggestion(error);
        } else if (suggestion) {
            setSuggestion(suggestion);
        }
    };

    return (
        <main className="flex h-screen w-screen flex-col items-center justify-center gap-6">
            <h1 className="mb-2 text-4xl font-medium">AdVerb</h1>

            <form onSubmit={generateSuggestion} className="flex w-full flex-col items-center gap-6 px-6">
                <textarea
                    name="user-prompt"
                    autoFocus={true}
                    placeholder="Your message goes here..."
                    className={`no-scrollbar w-full max-w-[700px] ${prompt.length > 150 ? "h-50" : "h-30"} rounded-xl border-2 border-[var(--color-foreground)]/60 px-6 py-4 transition-[height,colors] duration-200 outline-none focus:border-[var(--color-foreground)] dark:border-[var(--color-foreground)]/15 focus:dark:border-[var(--color-button-foreground)]/50`}
                    onChange={e => setPrompt(e.target.value)}
                />

                <Button>Optimize</Button>
            </form>

            {/* Suggestions */}
            <div className="flex w-full flex-col gap-6 px-6">
                {/* V1 */}
                <div className="flex w-full flex-col gap-2">
                    <label htmlFor="improv-v1" className="text-md opacity-75">
                        Improved Version
                    </label>

                    <div className="relative w-full">
                        {/* <Button variant={"outline"} className="absolute top-4 right-4">
                            Copy
                        </Button> */}

                        <textarea
                            id="improv-v1"
                            readOnly={true}
                            value={suggestion}
                            rows={6}
                            cols={30}
                            placeholder="Your improved ad..."
                            className={`no-scrollbar w-full max-w-[700px] ${suggestion.length > 150 ? "h-50" : "h-30"} rounded-xl border-2 border-[var(--color-foreground)]/60 px-6 py-4 transition-[height,colors] duration-200 outline-none focus:border-[var(--color-foreground)] dark:border-[var(--color-foreground)]/15 focus:dark:border-[var(--color-button-foreground)]/50`}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
