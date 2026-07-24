import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await request.json();

  const project = await prisma.project.update({
    where: { id },
    data: {
      name: body.name,
      data: body.data as any,
      ...(body.thumbnailUrl ? { thumbnailUrl: body.thumbnailUrl } : {}),
      ...(body.status ? { status: body.status } : {}),
    },
  });

  return NextResponse.json(project);
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
