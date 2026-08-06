import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { signToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import crypto from "crypto";

const REFERRAL_BONUS = 20;

export async function POST(request: Request) {
  try {
    const { email, password, name, referralCode } = (await request.json()) as {
      email: string; password: string; name?: string; referralCode?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Handle referral
    let referredBy: string | null = null;
    let bonusCredits = 0;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode } });
      if (referrer) {
        referredBy = referralCode;
        bonusCredits = REFERRAL_BONUS;
        // Give referrer bonus credits
        await prisma.user.update({
          where: { id: referrer.id },
          data: { credits: { increment: REFERRAL_BONUS } },
        });
        await prisma.creditLog.create({
          data: {
            userId: referrer.id,
            amount: REFERRAL_BONUS,
            type: "referral",
            reference: email,
            balance: referrer.credits + REFERRAL_BONUS,
          },
        });
      }
    }

    const hashedPassword = await hash(password, 10);
    const userCode = crypto.randomBytes(4).toString("hex");

    // Create DB user
    const user = await prisma.user.create({
      data: {
        clerkId: `email-${email}`,
        email,
        password: hashedPassword,
        name: name ?? email.split("@")[0],
        credits: 20 + bonusCredits,
        plan: "FREE",
        referralCode: userCode,
        referredBy,
      },
    });

    const token = await signToken({ userId: user.id, email });

    const userInfo = Buffer.from(JSON.stringify({
      name: user.name ?? email.split("@")[0],
      email: user.email,
    })).toString("base64");

    const res = NextResponse.json({
      success: true,
      email: user.email,
      name: user.name,
      referralCode: user.referralCode,
      bonusCredits,
    });
    res.cookies.set("token", token, {
      httpOnly: true, secure: true, sameSite: "lax",
      maxAge: 604800, path: "/",
    });
    res.cookies.set("user_info", userInfo, {
      httpOnly: false, secure: true, sameSite: "lax",
      maxAge: 604800, path: "/",
    });
    return res;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
