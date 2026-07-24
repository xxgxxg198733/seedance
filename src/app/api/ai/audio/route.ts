import { NextResponse } from "next/server";

// Audio page uses browser Web Speech API directly.
// This route is kept as a placeholder for future TTS API integration.
export async function POST(request: Request) {
  try {
    const { text } = (await request.json()) as { text: string };
    if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

    return NextResponse.json({
      message: "Use the /audio page for speech synthesis via browser Web Speech API.",
    });
  } catch {
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
