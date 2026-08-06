import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { signToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Find user in DB
    let user = await prisma.user.findUnique({ where: { email } });

    if (user && user.password) {
      // Verify password
      const valid = await compare(password, user.password);
      if (!valid) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }
    } else if (!user) {
      // Auto-create account for new email/password combos
      user = await prisma.user.create({
        data: {
          clerkId: `email-${email}`,
          email,
          name: email.split("@")[0],
          credits: 20,
          plan: "FREE",
          referralCode: crypto.randomBytes(4).toString("hex"),
        },
      });
    }

    const token = await signToken({ userId: user.id, email });

    const userInfo = Buffer.from(JSON.stringify({
      name: user.name ?? email.split("@")[0],
      email: user.email,
    })).toString("base64");

    const res = NextResponse.json({ success: true, email: user.email });
    res.cookies.set("token", token, {
      httpOnly: true, secure: true, sameSite: "lax",
      maxAge: 604800, path: "/",
    });
    res.cookies.set("user_info", userInfo, {
      httpOnly: false, secure: true, sameSite: "lax",
      maxAge: 604800, path: "/",
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: `Login failed: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
  }
}
