import { OtpPurpose } from "@prisma/client";

import { authRepository } from "../repositories/auth.repository";

import {
  compareOtp,
  generateOtp,
  getExpiryDate,
  hashOtp,
} from "../utils/otp";

import { mockProvider } from "../providers/mock.provider";

export class OtpService {
  async sendOtp(
    phone: string,
    purpose: OtpPurpose
  ) {
    const otp = generateOtp();

    const otpHash = await hashOtp(otp);

    await authRepository.clearPendingOtp(
      phone,
      purpose
    );

    await authRepository.createOtp({
      phone,
      otpHash,
      purpose,
      expiresAt: getExpiryDate(),
    });

    await mockProvider.send(
      phone,
      otp
    );

    return true;
  }

  async verifyOtp(
    phone: string,
    otp: string,
    purpose: OtpPurpose
  ) {
    const record =
      await authRepository.findLatestOtp(
        phone,
        purpose
      );

    if (!record) {
      throw new Error("OTP not found");
    }

    if (record.expiresAt < new Date()) {
      throw new Error("OTP expired");
    }

    if (record.attempts >= 5) {
      throw new Error("Maximum attempts exceeded");
    }

    const valid = await compareOtp(
      otp,
      record.otpHash
    );

    if (!valid) {
      await authRepository.increaseAttempts(
        record.id
      );

      throw new Error("Invalid OTP");
    }

    await authRepository.markVerified(
      record.id
    );

    return true;
  }
}

export const otpService =
  new OtpService();