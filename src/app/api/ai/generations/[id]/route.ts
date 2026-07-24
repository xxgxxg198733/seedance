import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const generation = await prisma.generation.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      type: true,
      output: true,
      error: true,
      creditCost: true,
      createdAt: true,
    },
  });

  if (!generation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(generation);
}
