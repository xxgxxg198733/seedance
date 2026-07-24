import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth/jwt";

const BASE_URL = "https://deepseekaiagent.com";
const REDIRECT_URI = `${BASE_URL}/api/auth/google/callback`;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      return NextResponse.redirect(new URL("/login?error=google_denied", BASE_URL));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.redirect(new URL("/login?error=google_not_configured", BASE_URL));
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Google token exchange failed:", errText);
      // Show the actual error in the URL so we can debug
      const errData = JSON.parse(errText);
      const detail = errData?.error_description ?? errData?.error ?? "unknown";
      return NextResponse.redirect(new URL(`/login?error=google_failed&detail=${encodeURIComponent(detail)}`, BASE_URL));
    }

    const tokens = (await tokenRes.json()) as { access_token: string };

    // Get user info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const googleUser = (await userRes.json()) as {
      email: string; name: string; picture: string; id: string;
    };

    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/login?error=google_no_email", BASE_URL));
    }

    // Sign JWT and set cookies
    const token = await signToken({
      userId: `google-${googleUser.id}`,
      email: googleUser.email,
    });

    const userInfo = Buffer.from(JSON.stringify({
      name: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture,
    })).toString("base64");

    const res = NextResponse.redirect(new URL("/agent", BASE_URL));
    res.cookies.set("token", token, {
      httpOnly: true, secure: true, sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, path: "/",
    });
    res.cookies.set("user_info", userInfo, {
      httpOnly: false, secure: true, sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, path: "/",
    });

    return res;
  } catch (err) {
    console.error("Google callback error:", err);
    return NextResponse.redirect(new URL("/login?error=google_error", BASE_URL));
  }
}
