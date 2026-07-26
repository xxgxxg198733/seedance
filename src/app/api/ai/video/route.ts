import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import { getModelById, getCreditCost } from "@/lib/ai/model-registry";
import { VolcanoArkAdapter } from "@/lib/ai/volcano-adapter";

function findVideoConfig(model: ReturnType<typeof getModelById>, duration: number): string {
  if (!model) return "";
  const keys = Object.keys(model.credits);
  // Try exact match: "720p_5s" style
  for (const res of ["720p", "1080p", "480p"]) {
    const key = `${res}_${duration}s`;
    if (keys.includes(key)) return key;
  }
  // Fallback: find key with matching duration
  const byDuration = keys.find((k) => k.includes(`${duration}s`));
  if (byDuration) return byDuration;
  // Last resort: first key
  return keys[0] ?? "";
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, credits: true, plan: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

    const body = await request.json();
    const {
      prompt,
      modelId,
      aspectRatio,
      duration,
      referenceImages,
      referenceAudio,
      referenceVideo,
    } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const selectedModel = modelId ?? "seedance-2";
    const model = getModelById(selectedModel);
    if (!model) {
      return NextResponse.json({ error: `Unknown model: ${selectedModel}` }, { status: 400 });
    }

    // 2. Calculate credit cost
    const videoDuration = duration ?? 5;
    const config = findVideoConfig(model, videoDuration);
    const creditCost = getCreditCost(selectedModel, config);

    // 3. Check balance
    if (user.credits < creditCost) {
      return NextResponse.json({
        error: `Insufficient credits. Need ${creditCost}, have ${user.credits}`,
        credits: user.credits,
        required: creditCost,
      }, { status: 402 });
    }

    const apiKey = process.env.VOLCANO_ARK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "VOLCANO_ARK_API_KEY not configured" }, { status: 500 });
    }

    // 4. Generate
    const adapter = new VolcanoArkAdapter(apiKey);
    const result = await adapter.generateVideo(model, {
      prompt,
      modelId: selectedModel,
      aspectRatio: aspectRatio ?? "16:9",
      duration: videoDuration,
      referenceImages,
      referenceAudio,
      referenceVideo,
    });

    // 5. Deduct credits & save records
    const newBalance = user.credits - creditCost;
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: newBalance },
    });
    await prisma.creditLog.create({
      data: {
        userId: user.id,
        amount: -creditCost,
        type: "generation",
        reference: `video:${selectedModel}:${config}`,
        balance: newBalance,
      },
    });
    await prisma.generation.create({
      data: {
        userId: user.id,
        type: "VIDEO",
        modelId: selectedModel,
        status: "COMPLETED",
        input: { prompt, aspectRatio: aspectRatio ?? "16:9", duration: videoDuration },
        output: { url: result.url },
        creditCost,
      },
    });

    return NextResponse.json({
      status: "COMPLETED",
      output: { url: result.url },
      model: model.name,
      credits_used: creditCost,
      credits_remaining: newBalance,
    });
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
