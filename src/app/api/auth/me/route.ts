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

    // Try DB first
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true, credits: true, plan: true, referralCode: true },
      });
      if (dbUser) return NextResponse.json({ user: dbUser });
    } catch {
      // DB not available — try by email
    }

    // Fallback: look up by email
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: payload.email },
        select: { id: true, email: true, name: true, credits: true, plan: true, referralCode: true },
      });
      if (dbUser) return NextResponse.json({ user: dbUser });
    } catch {
      // DB not available
    }

    // Google OAuth: construct user from JWT
    return NextResponse.json({
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.email?.split("@")[0] ?? "User",
        credits: 20,
        plan: "FREE",
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
