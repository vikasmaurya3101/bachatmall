import { OtpPurpose } from "@prisma/client";

export interface GenerateOtpPayload {
  phone: string;
  purpose: OtpPurpose;
}

export interface OtpProvider {
  send(phone: string, otp: string): Promise<void>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}