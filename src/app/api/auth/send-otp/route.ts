import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  sendOtpSchema,
} from "@/features/auth/validators/auth.validator";

import {
  otpService,
} from "@/features/auth/services/otp.service";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const data =
      sendOtpSchema.parse(body);

    await otpService.sendOtp(
      data.phone,
      "LOGIN"
    );

    return NextResponse.json({
      success: true,
      message:
        "OTP sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to send OTP.",
      },
      {
        status: 400,
      }
    );
  }
}