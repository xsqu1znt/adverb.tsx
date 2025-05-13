"use client";

import { ToneType } from "./api/optimize/[tone]/route";

import { StringSelectMenu } from "@/components/ui/StringSelectMenu";
import { TextInputArea } from "@/components/ui/TextInputArea";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, BookmarkPlus, Copy, Dices } from "lucide-react";
import OpenAI from "openai";

const tones = ["Professional", "Formal", "Playful", "Urgent", "Casual", "Witty", "Friendly", "Empathetic", "Bold"];

export default function Home() {
    const [prompt, setPrompt] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [tone, setTone] = useState<ToneType>("professional");

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

                <form onSubmit={generateSuggestion} className="flex w-full flex-col gap-6">
                    <TextInputArea
                        name="user-prompt"
                        placeholder="⚡ Put your ad here..."
                        className={` ${prompt.length ? "h-30" : "h-15"}`}
                        onChange={e => setPrompt(e.target.value)}
                    />

                    {/* <Button className="w-full">Try AdVerb Free!</Button> */}
                </form>
            </section>

            {/* Tone Select */}
            <section id="tones" className="flex w-full max-w-[700px] flex-col gap-12">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl">Step 2</h2>

                    <label htmlFor="tone-select">Choose the tone you're going for</label>
                    <StringSelectMenu
                        id="tone-select"
                        options={tones.map(t => ({ id: t, label: t }))}
                        direction="top"
                        // placeholder="Select your tone..."
                        className="w-full"
                        onOptionSelect={option => setTone(option.id as ToneType)}
                    />
                </div>
            </section>

            {/* Suggestions */}
            <section id="suggestions" className="flex w-full max-w-[700px] flex-col gap-12">
                <div className="flex w-full max-w-[700px] flex-col gap-4">
                    <h2 className="text-2xl">Step 3</h2>

                    <div className="flex items-center justify-between gap-4">
                        <label htmlFor="prompt-suggestion">Check out your optimized ad!</label>
                        <Button variant="outline" size="sm">
                            <Dices size={18} />
                            Reroll
                        </Button>
                    </div>

                    <div className="">
                        <TextInputArea
                            name="prompt-suggestion"
                            value={suggestion}
                            readOnly
                            placeholder="There seems to be nothing... Yet!"
                            className={`w-full rounded-b-none ${suggestion.length ? "h-30" : "h-15"} cursor-default`}
                        />

                        <div className="flex w-full items-center justify-between rounded-b-lg border border-t-0 border-[var(--color-foreground)]/60 bg-[var(--color-background)] dark:border-[var(--color-foreground)]/15">
                            {/* History Navigation */}
                            <div className="flex">
                                <Button variant="invisible" size="square" className="rounded-none px-6">
                                    <ArrowLeft size={20} />
                                </Button>

                                <Button variant="invisible" size="square" className="rounded-none rounded-br-lg px-6">
                                    <ArrowRight size={20} />
                                </Button>
                            </div>

                            {/* Options */}
                            <div className="flex">
                                <Button variant="invisible" size="square" className="rounded-none px-6">
                                    <BookmarkPlus size={20} />
                                </Button>

                                <Button variant="invisible" size="square" className="rounded-none rounded-br-lg px-6">
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
