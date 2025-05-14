import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ sessionId?: string }> }) {
    const { sessionId } = await params;
    if (!sessionId) {
        return NextResponse.json({ error: "Missing session ID." }, { status: 400 });
    }

    const sessionExists = await sql`select 1 from sessions where session_id = ${sessionId}`;
    if (!sessionExists.length) {
        return NextResponse.json({ error: "Session does not exist." }, { status: 404 });
    }

    const userPrompts = await sql`select * from user_prompts where session_id = ${sessionId}`;
    const optimizedSuggestions = await sql`select * from optimized_suggestions where session_id = ${sessionId}`;

    return NextResponse.json(
        { userPrompts: userPrompts || [], optimizedSuggestions: optimizedSuggestions || [] },
        { status: 200 }
    );
}
