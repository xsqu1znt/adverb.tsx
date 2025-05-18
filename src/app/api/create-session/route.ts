import { NextRequest, NextResponse } from "next/server";
import { names } from "@/constants/names";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
    const sessionId = crypto.randomUUID();
    const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${names[Math.floor(Math.random() * names.length)]}&scale=80`;
    const res =
        await sql`insert into sessions (session_id, avatar_url) values (${sessionId}, ${avatarUrl}) returning session_id`;
    return NextResponse.json({ sessionId: res[0].session_id });
}
