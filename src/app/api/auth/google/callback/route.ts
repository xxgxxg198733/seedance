import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth/jwt";

const GOOGLE_CLIENT_ID = "43452014125-8t1s71o8ngsv17ugpabsnrcmd5d9gkhf.apps.googleusercontent.com";

export async function POST(request: Request) {
  try {
    const { credential } = (await request.json()) as { credential: string };
    if (!credential) {
      return NextResponse.json({ error: "No credential" }, { status: 400 });
    }

    // Verify the ID token with Google's public keys — no client_secret needed
    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    if (!verifyRes.ok) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const googleUser = (await verifyRes.json()) as {
      sub: string; email: string; name: string; picture: string;
      aud: string;
    };

    // Verify the token is for our app
    if (googleUser.aud !== GOOGLE_CLIENT_ID) {
      return NextResponse.json({ error: "Wrong audience" }, { status: 401 });
    }

    // Sign JWT
    const token = await signToken({
      userId: `google-${googleUser.sub}`,
      email: googleUser.email,
    });

    const userInfo = Buffer.from(JSON.stringify({
      name: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture,
    })).toString("base64");

    const res = NextResponse.json({ success: true, email: googleUser.email, name: googleUser.name });
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
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
