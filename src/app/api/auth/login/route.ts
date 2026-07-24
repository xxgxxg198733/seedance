import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { signToken } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.password) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const valid = await compare(password, user.password);
    if (!valid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

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
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
