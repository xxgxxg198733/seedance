import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { signToken } from "@/lib/auth/jwt";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      const redirect = searchParams.get("state") ?? "/agent";
      return NextResponse.redirect(new URL(`/login?error=google_denied`, request.url));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://deepseekaiagent.com";
    const redirectUri = `${origin}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Google token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(new URL("/login?error=google_failed", request.url));
    }

    const tokens = (await tokenRes.json()) as { access_token: string; id_token: string };

    // Get user info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const googleUser = (await userRes.json()) as {
      email: string; name: string; picture: string; id: string;
    };

    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/login?error=google_no_email", request.url));
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: googleUser.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: `google-${googleUser.id}`,
          email: googleUser.email,
          name: googleUser.name,
          avatarUrl: googleUser.picture,
          password: null, // Google OAuth users have no password
        },
      });
    }

    // Sign JWT and redirect
    const token = await signToken({ userId: user.id, email: user.email });
    const redirect = searchParams.get("state") ?? "/agent";
    const res = NextResponse.redirect(new URL(redirect, request.url));

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Google callback error:", err);
    return NextResponse.redirect(new URL("/login?error=google_error", "https://deepseekaiagent.com"));
  }
}
