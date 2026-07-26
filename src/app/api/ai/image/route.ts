import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import { getModelById, getCreditCost } from "@/lib/ai/model-registry";
import { VolcanoArkAdapter } from "@/lib/ai/volcano-adapter";

function findImageConfig(model: ReturnType<typeof getModelById>, resolution: string): string {
  if (!model) return "";
  const keys = Object.keys(model.credits);
  // Map frontend resolution to config keys
  if (resolution === "1K") {
    const match = keys.find((k) => k.includes("1024"));
    if (match) return match;
  }
  if (keys.includes(resolution)) return resolution;
  // Fallback: first key
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
    const { prompt, modelId, aspectRatio, resolution, referenceImages } = body;

    if (!prompt && !referenceImages?.length) {
      return NextResponse.json({ error: "Prompt or reference image required" }, { status: 400 });
    }

    const selectedModel = modelId ?? "seedream-5";
    const model = getModelById(selectedModel);
    if (!model) {
      return NextResponse.json({ error: `Unknown model: ${selectedModel}` }, { status: 400 });
    }

    // 2. Calculate credit cost
    const imgResolution = resolution ?? "2K";
    const config = findImageConfig(model, imgResolution);
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
    const result = await adapter.generateImage(model, {
      prompt: prompt || "Generate a variation of the reference image",
      modelId: selectedModel,
      aspectRatio: aspectRatio ?? "1:1",
      resolution: imgResolution,
      referenceImages,
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
        reference: `image:${selectedModel}:${config}`,
        balance: newBalance,
      },
    });
    await prisma.generation.create({
      data: {
        userId: user.id,
        type: "IMAGE",
        modelId: selectedModel,
        status: "COMPLETED",
        input: { prompt, aspectRatio: aspectRatio ?? "1:1", resolution: imgResolution },
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
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
