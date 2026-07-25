import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { signToken } from "@/lib/auth/jwt";

// Simple in-memory user store for email/password users
// In production, use a real database
const DEMO_USER = {
  email: "demo@seedance.ai",
  // bcrypt hash of "demo123"
  password: "$2a$10$placeholder",
  name: "Demo User",
};

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // For now, accept any email/password combo for demo purposes
    // Real DB integration will come when we set up a proper database
    const token = await signToken({ userId: `email-${email}`, email });

    const userInfo = Buffer.from(JSON.stringify({
      name: email.split("@")[0],
      email,
    })).toString("base64");

    const res = NextResponse.json({ success: true, email });
    res.cookies.set("token", token, {
      httpOnly: true, secure: true, sameSite: "lax",
      maxAge: 604800, path: "/",
    });
    res.cookies.set("user_info", userInfo, {
      httpOnly: false, secure: true, sameSite: "lax",
      maxAge: 604800, path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
