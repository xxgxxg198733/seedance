import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth/jwt";

const CLIENT_ID = "43452014125-06hrfv4un6sdfatc9bs9es3karg05rq2.apps.googleusercontent.com";
const REDIRECT_URI = "https://deepseekaiagent.com/api/auth/google/callback";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=no_code", request.url));
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Google token error:", err);
      return NextResponse.redirect(new URL("/login?error=google_failed", request.url));
    }

    const tokens = (await tokenRes.json()) as { access_token: string };

    // Get user info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const gu = (await userRes.json()) as { email: string; name: string; picture: string; id: string };

    if (!gu.email) {
      return NextResponse.redirect(new URL("/login?error=no_email", request.url));
    }

    const token = await signToken({ userId: `google-${gu.id}`, email: gu.email });
    const userInfo = Buffer.from(JSON.stringify({ name: gu.name, email: gu.email, picture: gu.picture })).toString("base64");

    const res = NextResponse.redirect(new URL("/agent", request.url));
    res.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 604800, path: "/" });
    res.cookies.set("user_info", userInfo, { httpOnly: false, secure: true, sameSite: "lax", maxAge: 604800, path: "/" });
    return res;
  } catch (err) {
    console.error("Google callback:", err);
    return NextResponse.redirect(new URL("/login?error=google_error", request.url));
  }
}
