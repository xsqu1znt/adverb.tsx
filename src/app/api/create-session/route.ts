import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
    const sessionId = crypto.randomUUID();
    const res = await sql`insert into sessions (session_id) values (${sessionId}) returning session_id, created_at`;
    return NextResponse.json({ sessionId: res[0].session_id });
}
