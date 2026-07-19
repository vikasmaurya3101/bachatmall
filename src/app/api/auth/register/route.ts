import { NextResponse } from "next/server";

/**
 * This app doesn't support direct registration — account creation always
 * happens through the phone + OTP flow (send-otp -> verify-otp ->
 * complete-profile) so every account has a verified phone number.
 * This endpoint exists only to give API consumers a clear, non-empty
 * response instead of a 404/500 if something still calls it.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Direct registration isn't supported. Use /api/auth/send-otp to start sign-up.",
    },
    { status: 410 }
  );
}
