import { NextResponse } from "next/server";

export async function GET() {
  const redirectUri = "https://deepseekaiagent.com/api/auth/google/callback";

  const params = new URLSearchParams({
    client_id: "43452014125-06hrfv4un6sdfatc9bs9es3karg05rq2.apps.googleusercontent.com",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
