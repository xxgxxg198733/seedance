import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { projectDataSchema } from "@/lib/validations/schemas";

export async function GET() {
  const user = await prisma.user.findFirst({ where: { email: "demo@example.com" } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      status: true,
      thumbnailUrl: true,
      duration: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const user = await prisma.user.findFirst({ where: { email: "demo@example.com" } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = projectDataSchema.safeParse(body.data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: body.name ?? "Untitled Project",
      data: body.data as any,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
