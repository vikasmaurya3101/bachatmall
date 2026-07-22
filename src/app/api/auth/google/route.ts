import { NextRequest, NextResponse } from "next/server";

/**
 * Starts the Google OAuth2 Authorization Code flow. The `redirect` query
 * param (where to send the user after a successful login) is round-tripped
 * through Google via the `state` param and read back in the callback.
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Google login isn't configured. Set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in .env.",
      },
      { status: 500 }
    );
  }

  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";
  const callbackUrl = new URL("/api/auth/google/callback", request.url);

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", callbackUrl.toString());
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("prompt", "select_account");
  authUrl.searchParams.set("state", redirectTo);

  return NextResponse.redirect(authUrl.toString());
}
