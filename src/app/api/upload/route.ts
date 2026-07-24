import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/db/prisma";

const MAX_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "IMAGE",
  "image/jpeg": "IMAGE",
  "image/webp": "IMAGE",
  "image/gif": "IMAGE",
  "video/mp4": "VIDEO",
  "video/webm": "VIDEO",
  "video/quicktime": "VIDEO",
  "audio/mpeg": "AUDIO",
  "audio/mp3": "AUDIO",
  "audio/wav": "AUDIO",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: `File too large. Max ${MAX_SIZE / 1024 / 1024}MB` }, { status: 400 });

    const assetType = ALLOWED_TYPES[file.type];
    if (!assetType) return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });

    const ext = file.name.split(".").pop() ?? "png";
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const uploadsDir = join(process.cwd(), "public", "uploads");

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const url = `${appUrl}/uploads/${filename}`;

    // Track in database
    const asset = await prisma.asset.create({
      data: {
        userId: (await prisma.user.findFirst())?.id ?? "anonymous",
        type: assetType as "IMAGE" | "VIDEO" | "AUDIO",
        name: file.name,
        url,
        size: file.size,
        mimeType: file.type,
      },
    }).catch(() => null); // Don't fail if no user in DB

    return NextResponse.json({
      url,
      id: asset?.id,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
