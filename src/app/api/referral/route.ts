import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { referralCode: true, credits: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Count referrals
    const referralCount = await prisma.user.count({
      where: { referredBy: user.referralCode! },
    });

    // Get referral credits earned
    const referralLogs = await prisma.creditLog.findMany({
      where: { userId: payload.userId, type: "referral" },
      select: { amount: true, reference: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const referralLink = `https://deepseekaiagent.com/register?ref=${user.referralCode}`;

    return NextResponse.json({
      referralCode: user.referralCode,
      referralLink,
      referralCount,
      referralCredits: referralLogs.reduce((sum, l) => sum + l.amount, 0),
      recentReferrals: referralLogs.map((l) => ({
        user: (l.reference ?? "").split("@")[0],
        credits: l.amount,
        date: l.createdAt,
      })),
    });
  } catch (error) {
    console.error("Referral error:", error);
    return NextResponse.json({ error: "Failed to get referral info" }, { status: 500 });
  }
}
