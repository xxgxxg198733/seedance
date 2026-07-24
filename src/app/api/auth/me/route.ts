import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ user: null }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, credits: true, plan: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Me error:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
