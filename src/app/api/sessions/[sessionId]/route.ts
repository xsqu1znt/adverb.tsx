import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ sessionId?: string }> }) {
    const { sessionId } = await params;
    const url = new URL(req.nextUrl);
    const type = url.searchParams.get("type");

    if (!sessionId) {
        return NextResponse.json({ error: "Missing session ID." }, { status: 400 });
    }

    const sessionExists = await sql`select 1 from sessions where session_id = ${sessionId}`;
    if (!sessionExists.length) {
        return NextResponse.json({ error: "Session does not exist." }, { status: 404 });
    }

    let data;

    if (type === "avatar") {
        const [{ avatar_url: avatarUrl }] = await sql`select avatar_url from sessions where session_id = ${sessionId}`;
        data = { exists: avatarUrl !== undefined, avatarUrl: avatarUrl || null };
    } else if (type === "history") {
        const userPrompts = await sql`select * from user_prompts where session_id = ${sessionId}`;
        const optimizedSuggestions = await sql`select * from optimized_suggestions where session_id = ${sessionId}`;
        data = {
            exists: userPrompts && optimizedSuggestions ? true : false,
            userPrompts: userPrompts || [],
            optimizedSuggestions: optimizedSuggestions || []
        };
    } else {
        data = { error: "Session fetch type not provided." };
    }

    return NextResponse.json(data, { status: 200 });
}
