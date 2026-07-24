import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { signToken } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    const { email, password, name } = (await request.json()) as {
      email: string; password: string; name?: string;
    };

    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const hashed = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        clerkId: crypto.randomUUID(),
        email,
        password: hashed,
        name: name ?? email.split("@")[0],
      },
    });

    const token = await signToken({ userId: user.id, email: user.email });
    const isProd = process.env.NODE_ENV === "production";

    const res = NextResponse.json({ id: user.id, email: user.email, name: user.name, credits: user.credits, plan: user.plan });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
