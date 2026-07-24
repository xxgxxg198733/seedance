import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const folderId = searchParams.get("folderId");

  const user = await prisma.user.findFirst({ where: { email: "demo@example.com" } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assets = await prisma.asset.findMany({
    where: {
      userId: user.id,
      ...(type ? { type: type as "IMAGE" | "VIDEO" | "AUDIO" | "OTHER" } : {}),
      ...(folderId !== null ? { folderId: folderId || null } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(assets);
}

export async function POST(request: Request) {
  // In production: handle file upload to R2 via Uploadthing
  // For now: create a mock asset
  const user = await prisma.user.findFirst({ where: { email: "demo@example.com" } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const asset = await prisma.asset.create({
    data: {
      userId: user.id,
      type: body.type ?? "IMAGE",
      name: body.name ?? "Untitled",
      url: body.url ?? "",
      mimeType: body.mimeType ?? "image/png",
      size: body.size,
      width: body.width,
      height: body.height,
      duration: body.duration,
      metadata: body.metadata as any | undefined,
    },
  });

  return NextResponse.json(asset, { status: 201 });
}
