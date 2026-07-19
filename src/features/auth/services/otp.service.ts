import { OtpPurpose } from "@prisma/client";

import { authRepository } from "../repositories/auth.repository";

import {
  compareOtp,
  generateOtp,
  getExpiryDate,
  hashOtp,
} from "../utils/otp";

import { mockProvider } from "../providers/mock.provider";
import { whatsappProvider } from "../providers/whatsapp.provider";
import { smsProvider } from "../providers/sms.provider";

/**
 * Picks the OTP delivery provider based on process.env.OTP_PROVIDER:
 * - "whatsapp": WhatsApp primary, falls back to SMS if it fails
 * - "sms": SMS only
 * - anything else (default "mock"): logs the OTP to the console (dev only)
 */
async function deliverOtp(phone: string, otp: string) {
  const provider = (process.env.OTP_PROVIDER ?? "mock").toLowerCase();

  if (provider === "whatsapp") {
    try {
      await whatsappProvider.send(phone, otp);
      return;
    } catch (err) {
      console.error("WhatsApp OTP delivery failed, falling back to SMS:", err);
      await smsProvider.send(phone, otp);
      return;
    }
  }

  if (provider === "sms") {
    await smsProvider.send(phone, otp);
    return;
  }

  await mockProvider.send(phone, otp);
}

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

    await deliverOtp(phone, otp);

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