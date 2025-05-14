"use client";

import { ToneType } from "./api/optimize/[tone]/route";

import { StringSelectMenu } from "@/components/ui/StringSelectMenu";
import { TextInputArea } from "@/components/ui/TextInputArea";
import React, { useEffect, useState } from "react";
import { Button, buttonSizes } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, BookmarkPlus, Copy, Dices, SendHorizonal } from "lucide-react";
import OpenAI from "openai";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

const tones = ["Professional", "Formal", "Playful", "Urgent", "Casual", "Witty", "Friendly", "Empathetic", "Bold"];

export default function Home() {
    const [userPrompt, setUserPrompt] = useState("");
    const [lastUserPrompt, setLastUserPrompt] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [tone, setTone] = useState<ToneType>("professional");

    const [userSession, setUserSession] = useState<string | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);

    useEffect(() => {
        setIsOptimizing(false);
    }, [suggestion]);

    const generateSuggestion = async () => {
        if (!userPrompt) {
            alert("Please enter a prompt!");
            return;
        }

        setIsOptimizing(true);

        const res = await fetch(`/api/optimize/${tone}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: userPrompt })
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

        setLastUserPrompt(userPrompt);
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
                            disabled={isOptimizing}
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
                        className={`w-full p-0 ${userSession ? "hidden" : ""}`}
                        disabled={!userPrompt.length}
                        onClick={() => setUserSession(!userSession ? "signed-in" : null)}
                    >
                        <a href="#tone" className={cn("h-full w-full", buttonSizes.md)}>
                            Get Started with AdVerb
                        </a>
                    </Button>
                </div>
            </section>

            {/* Tone Select */}
            <section
                id="tone"
                className={`flex w-full max-w-[700px] flex-col gap-12 ${!userSession || !userPrompt ? "hidden" : ""} sectionFadeIn`}
            >
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl">Step 2</h2>

                    <label htmlFor="tone-select">Choose the tone you're going for</label>
                    <StringSelectMenu
                        id="tone-select"
                        options={tones.map(t => ({ id: t, label: t }))}
                        direction="top"
                        disabled={isOptimizing}
                        className="w-full"
                        variant="outline"
                        onOptionSelect={option => setTone(option.id as ToneType)}
                    />
                </div>
            </section>

            {/* Suggestions */}
            <section
                id="suggestion"
                className={`flex w-full max-w-[700px] flex-col gap-12 ${!userSession || !userPrompt.length ? "hidden" : ""} sectionFadeIn`}
                style={{ animationDelay: "0.2s" }}
            >
                <div className="flex w-full max-w-[700px] flex-col gap-4">
                    <h2 className="text-2xl">Step 3</h2>

                    <div className="flex items-center justify-between gap-4">
                        <label htmlFor="prompt-suggestion">Check out your optimized ad!</label>
                        <Button variant="primary" size="sm" disabled={isOptimizing} onClick={() => generateSuggestion()}>
                            {lastUserPrompt && userPrompt === lastUserPrompt ? <Dices size={18} /> : ""}
                            {lastUserPrompt && userPrompt === lastUserPrompt ? "Reroll" : "Optimize"}
                            {lastUserPrompt && userPrompt === lastUserPrompt ? "" : <SendHorizonal size={18} />}
                        </Button>
                    </div>

                    <div className="">
                        <TextInputArea
                            name="prompt-suggestion"
                            value={suggestion}
                            readOnly
                            placeholder={isOptimizing ? "Optimizing..." : "There seems to be nothing... Yet!"}
                            disabled={isOptimizing}
                            className={`w-full rounded-b-none ${suggestion.length ? (suggestion.length > 250 ? "h-50" : "h-30") : "h-15"} cursor-default`}
                        />

                        <div className="flex w-full items-center justify-between rounded-b-lg border border-t-0 border-[var(--color-foreground)]/60 bg-[var(--color-background)] dark:border-[var(--color-foreground)]/15">
                            {/* History Navigation */}
                            <div className="flex">
                                <Button
                                    variant="invisible"
                                    size="square"
                                    disabled={isOptimizing || !suggestion.length}
                                    className="rounded-none rounded-bl-lg px-6"
                                >
                                    <ArrowLeft size={20} />
                                </Button>

                                <Button
                                    variant="invisible"
                                    size="square"
                                    disabled={isOptimizing || !suggestion.length}
                                    className="rounded-none px-6"
                                >
                                    <ArrowRight size={20} />
                                </Button>
                            </div>

                            {/* Options */}
                            <div className="flex">
                                <Button
                                    variant="invisible"
                                    size="square"
                                    disabled={isOptimizing || !suggestion.length}
                                    className="rounded-none px-6"
                                >
                                    <BookmarkPlus size={20} />
                                </Button>

                                <Button
                                    variant="invisible"
                                    size="square"
                                    disabled={isOptimizing || !suggestion.length}
                                    className="rounded-none rounded-br-lg px-6"
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
