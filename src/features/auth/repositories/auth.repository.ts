import { OtpPurpose } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class AuthRepository {
  async deletePendingOtps(phone: string, purpose: OtpPurpose) {
    return prisma.otpVerification.deleteMany({
      where: {
        phone,
        purpose,
        isVerified: false,
      },
    });
  }

  async createOtp(data: {
    phone: string;
    otpHash: string;
    purpose: OtpPurpose;
    expiresAt: Date;
  }) {
    return prisma.otpVerification.create({
      data: {
        phone: data.phone,
        otpHash: data.otpHash,
        purpose: data.purpose,
        channel: "WHATSAPP",
        expiresAt: data.expiresAt,
      },
    });
  }

  async findLatestOtp(phone: string, purpose: OtpPurpose) {
    return prisma.otpVerification.findFirst({
      where: {
        phone,
        purpose,
        isVerified: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async incrementAttempts(id: string) {
    return prisma.otpVerification.update({
      where: { id },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });
  }

  async markVerified(id: string) {
    return prisma.otpVerification.update({
      where: { id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      },
    });
  }

  async findUserByPhone(phone: string) {
    return prisma.user.findUnique({
      where: { phone },
    });
  }

  async createUser(phone: string) {
    return prisma.user.create({
      data: {
        phone,
        firstName: "",
        lastName: null,
        phoneVerified: true,
      },
    });
  }

  async verifyUserPhone(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        phoneVerified: true,
      },
    });
  }
}

export const authRepository = new AuthRepository();