import { NextResponse } from "next/server";
import { getModelById } from "@/lib/ai/model-registry";
import { VolcanoArkAdapter } from "@/lib/ai/volcano-adapter";

export async function POST(request: Request) {
  try {
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

    const apiKey = process.env.VOLCANO_ARK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "VOLCANO_ARK_API_KEY not configured" }, { status: 500 });
    }

    const adapter = new VolcanoArkAdapter(apiKey);
    const result = await adapter.generateImage(model, {
      prompt: prompt || "Generate a variation of the reference image",
      modelId: selectedModel,
      aspectRatio: aspectRatio ?? "1:1",
      resolution: resolution ?? "2K",
      referenceImages,
    });

    return NextResponse.json({
      status: "COMPLETED",
      output: { url: result.url },
      model: model.name,
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
