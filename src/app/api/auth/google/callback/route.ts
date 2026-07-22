import { NextRequest, NextResponse } from "next/server";
import { authRepository } from "@/features/auth/repositories/auth.repository";
import { createSession } from "@/lib/session";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

/** Only allow redirecting back to a relative in-app path — never an external URL. */
function safeRedirect(target: string | null): string {
  if (target && target.startsWith("/") && !target.startsWith("//")) {
    return target;
  }
  return "/";
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");

  const redirectTo = safeRedirect(state);
  const loginUrl = new URL("/login", request.url);

  if (oauthError || !code) {
    loginUrl.searchParams.set("error", "google_login_failed");
    return NextResponse.redirect(loginUrl);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    loginUrl.searchParams.set("error", "google_not_configured");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const callbackUrl = new URL("/api/auth/google/callback", request.url);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl.toString(),
        grant_type: "authorization_code",
      }),
    });

    const tokenData: GoogleTokenResponse = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Google token exchange failed:", tokenData);
      loginUrl.searchParams.set("error", "google_login_failed");
      return NextResponse.redirect(loginUrl);
    }

    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    const googleUser: GoogleUserInfo = await userInfoRes.json();

    if (!googleUser.email) {
      loginUrl.searchParams.set("error", "google_no_email");
      return NextResponse.redirect(loginUrl);
    }

    let user = await authRepository.findUserByGoogleId(googleUser.sub);

    if (!user) {
      const existingByEmail = await authRepository.findUserByEmail(
        googleUser.email
      );

      if (existingByEmail) {
        // Same email already has an account (e.g. signed up via phone
        // OTP earlier) — link Google to it rather than creating a duplicate.
        user = await authRepository.linkGoogleAccount(existingByEmail.id, {
          googleId: googleUser.sub,
          profileImage: googleUser.picture,
        });
      } else {
        user = await authRepository.createUserFromGoogle({
          googleId: googleUser.sub,
          email: googleUser.email,
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          profileImage: googleUser.picture,
        });
      }
    }

    await createSession({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    // New Google accounts (and any linked account without a verified
    // phone) get sent to add one before continuing.
    const destination = !user.phone
      ? `/add-phone?redirect=${encodeURIComponent(redirectTo)}`
      : redirectTo;

    return NextResponse.redirect(new URL(destination, request.url));
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    loginUrl.searchParams.set("error", "google_login_failed");
    return NextResponse.redirect(loginUrl);
  }
}
