import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    const { email, password, name } = (await request.json()) as {
      email: string; password: string; name?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const token = await signToken({ userId: `email-${email}`, email });

    const userInfo = Buffer.from(JSON.stringify({
      name: name ?? email.split("@")[0],
      email,
    })).toString("base64");

    const res = NextResponse.json({ success: true, email, name });
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
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
