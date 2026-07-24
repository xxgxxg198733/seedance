import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const user = userId
      ? await prisma.user.findUnique({ where: { id: userId } })
      : await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json({ credits: 0, plan: "FREE", history: [] });
    }

    const history = await prisma.creditLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ credits: user.credits, plan: user.plan, history });
  } catch {
    return NextResponse.json({ credits: 0, plan: "FREE", history: [] });
  }
}
