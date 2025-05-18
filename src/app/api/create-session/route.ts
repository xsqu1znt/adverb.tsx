import { NextRequest, NextResponse } from "next/server";
import { names } from "@/constants/names";
import supabase from "@/lib/db";

export async function POST(req: NextRequest) {
    const sessionId = crypto.randomUUID();
    const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${names[Math.floor(Math.random() * names.length)]}&scale=80`;

    const { error, data } = await supabase
        .from("sessions")
        .insert([{ session_id: sessionId, avatar_url: avatarUrl }])
        .select("session_id")
        .single();

    return NextResponse.json(!error ? { sessionId: data?.session_id } : { error }, { status: 200 });
}
