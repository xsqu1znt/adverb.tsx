import { NextRequest, NextResponse } from "next/server";
import { tones, ToneType } from "@/lib/tones";
import openai from "@/lib/openai";
import sql from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ tone?: ToneType }> }) {
    const { text, sessionId } = (await req.json()) as { text?: string; sessionId?: string };
    const { tone } = await params;

    const sessionExists = await sql`select COUNT(1) from sessions where session_id = ${sessionId || "0"}`;

    if (!sessionExists) {
        return NextResponse.json({ error: "User session does not exist." }, { status: 404 });
    }

    if (!text) {
        return NextResponse.json({ error: "Missing user prompt content." }, { status: 400 });
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

    const res =
        await sql`insert into optimized_suggestions (session_id, text, tone_used, tokens_used) values (${sessionId!}, ${completion.choices[0].message.content}, ${tone}, ${completion.usage?.total_tokens || 0}) returning text`;
    if (!res) {
        return NextResponse.json({ error: "Failed to process the optimized suggestion." }, { status: 500 });
    }

    await sql`insert into user_prompts (session_id, text) values (${sessionId!}, ${text})`;

    return NextResponse.json({ optimized: res[0].text }, { status: 200 });
}
