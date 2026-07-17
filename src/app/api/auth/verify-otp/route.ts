import { NextRequest, NextResponse } from "next/server";
import { otpService } from "@/features/auth/services/otp.service";
import { authRepository } from "@/features/auth/repositories/auth.repository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone and OTP are required.",
        },
        { status: 400 }
      );
    }

    await otpService.verifyOtp(
      phone,
      otp,
      "LOGIN"
    );

    const user =
      await authRepository.findUser(phone);

    if (!user) {
      return NextResponse.json({
        success: true,
        isNewUser: true,
        message:
          "OTP verified. Complete your profile.",
      });
    }

    return NextResponse.json({
      success: true,
      isNewUser: false,
      message: "Login successful.",
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phoneVerified: user.phoneVerified,
      },
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 400 }
    );
  }
}