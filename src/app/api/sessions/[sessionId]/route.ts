import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ sessionId?: string }> }) {
    const { sessionId } = await params;
    const url = new URL(req.nextUrl);
    const type = url.searchParams.get("type");

    if (!sessionId) {
        return NextResponse.json({ error: "Missing session ID." }, { status: 404 });
    }

    const { error: sessionExistsError, data: sessionExists } = await supabase
        .from("sessions")
        .select("session_id")
        .eq("session_id", sessionId);

    if (sessionExistsError || !sessionExists) {
        return NextResponse.json({ error: "User session does not exist." }, { status: 404 });
    }

    let data;

    switch (type) {
        case "avatar":
            const { error: sessionAvatarError, data: sessionAvatar } = await supabase
                .from("sessions")
                .select("avatar_url")
                .eq("session_id", sessionId)
                .single();

            data = sessionAvatarError
                ? { error: sessionAvatarError }
                : { exists: data ? true : false, avatarUrl: sessionAvatar?.avatar_url || null };
            break;

        case "history":
            const { error: userPromptsError, data: userPrompts } = await supabase
                .from("user_prompts")
                .select("*")
                .eq("session_id", sessionId);
            const { error: optimizedSuggestionsError, data: optimizedSuggestions } = await supabase
                .from("optimized_suggestions")
                .select("*")
                .eq("session_id", sessionId);

            data =
                userPromptsError || optimizedSuggestionsError
                    ? { error: userPromptsError || optimizedSuggestionsError }
                    : {
                          exists: userPrompts && optimizedSuggestions ? true : false,
                          userPrompts: userPrompts || [],
                          optimizedSuggestions: optimizedSuggestions || []
                      };
            break;

        default:
            data = { error: "Session fetch type not provided." };
            break;
    }

    return NextResponse.json(data, { status: data?.error ? 404 : 200 });
}
