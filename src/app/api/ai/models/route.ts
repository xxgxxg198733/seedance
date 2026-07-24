import { NextResponse } from "next/server";
import { MODEL_REGISTRY } from "@/lib/ai/model-registry";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let models = Object.values(MODEL_REGISTRY);
  if (type) models = models.filter((m) => m.type === type);

  return NextResponse.json(models);
}
