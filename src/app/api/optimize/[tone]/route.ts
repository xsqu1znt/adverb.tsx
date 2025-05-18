import { NextRequest, NextResponse } from "next/server";
import { tones, ToneType } from "@/constants/tones";
import openai from "@/lib/openai";
import supabase from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ tone?: ToneType }> }) {
    const { text, sessionId } = (await req.json()) as { text?: string; sessionId?: string };
    const { tone } = await params;

    const { error: sessionExistsError, data: sessionExists } = await supabase
        .from("sessions")
        .select("session_id")
        .eq("session_id", sessionId)
        .single();
    if (sessionExistsError || !sessionExists) {
        return NextResponse.json({ error: "User session does not exist." }, { status: 404 });
    }

    if (!text) {
        return NextResponse.json({ error: "Missing user prompt text." }, { status: 400 });
    }

    if (!tone || !Object.hasOwn(tones, tone.toLowerCase())) {
        return NextResponse.json({ error: "Missing or invalid tone." }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "developer", content: tones[tone.toLowerCase() as ToneType].prompt },
            { role: "user", content: text }
        ],
        max_completion_tokens: 200
    });

    if (!completion.choices[0].message.content) {
        return NextResponse.json({ error: "OpenAI was unable to process this request." }, { status: 500 });
    }

    const [{ error: optimizationError, data: optimization }, { error: userPromptError, data: userPrompt }] =
        await Promise.all([
            supabase
                .from("optimized_suggestions")
                .insert([
                    {
                        session_id: sessionId,
                        text: completion.choices[0].message.content,
                        tone_used: tone,
                        tokens_used: completion.usage?.total_tokens || 0
                    }
                ])
                .select("text")
                .single(),

            supabase
                .from("user_prompts")
                .insert([{ session_id: sessionId, text: text }])
                .select("text")
                .single()
        ]);

    if (optimizationError || userPromptError) {
        return NextResponse.json({ error: "Failed to process the optimized suggestion." }, { status: 500 });
    }

    return NextResponse.json({ optimized: optimization.text }, { status: 200 });
}
