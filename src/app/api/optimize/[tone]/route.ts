export type ToneType =
    | "formal"
    | "playful"
    | "urgent"
    | "professional"
    | "casual"
    | "witty"
    | "friendly"
    | "empathetic"
    | "bold"
    | "default";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// prettier-ignore
export const tonePrompts: Record<ToneType, string> = {
    formal: "You're an expert copywriter. Rewrite the message below to sound formal and professional. Keep it under 300 characters.",
    playful: "Rewrite the message with a playful and cheeky tone. Make it fun and attention-grabbing, suitable for SMS or social media. Keep it under 300 characters.",
    urgent: "You're an expert copywriter. Rewrite the message below to sound urgent and persuasive. Create FOMO while keeping it under 300 characters.",
    professional: "Refine the following message into a clear, confident, and professional tone. Keep it polished and under 300 characters.",
    casual: "Rewrite the message in a friendly, casual tone like you’re talking to a friend. Make it short, clear, and engaging. Limit to 300 characters.",
    witty: "Make the message sharp, witty, and clever without being cringey. Keep it under 300 characters and suitable for performance marketing.",
    friendly: "Rewrite the message in a friendly, warm tone like you’re talking to a friend. Make it short, clear, and engaging. Limit to 300 characters.",
    empathetic: "Rewrite the message with a caring, human-centered tone. Show empathy while still encouraging action. Limit to 300 characters.",
    bold: "Rewrite the message with a bold, assertive tone. Be confident, punchy, and direct — make the user feel like they'd miss out if they ignore it. Max 300 characters.",
    default: "You're a copywriting assistant. Rewrite the following marketing message to be more engaging, clear, and persuasive for SMS or ad copy. Keep it under 300 characters.",
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ tone: ToneType }> }) {
    const { text } = (await req.json()) as { text: string };
    const { tone } = await params;

    if (!text || !tone) {
        return NextResponse.json({ error: "Missing text or tone." }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "developer",
                content: tonePrompts[tone.toLowerCase() as ToneType] ?? tonePrompts.default
            },
            { role: "user", content: text }
        ],
        max_completion_tokens: 200
    });

    const resJSON = {
        suggestion: completion.choices[0].message.content ?? "Unable to process request.",
        usage: completion.usage
    };

    return NextResponse.json(resJSON, { status: 200 });
}
