export type OtpPurpose = "LOGIN" | "SIGNUP" | "RESET";

export type OtpChannel = "WHATSAPP" | "SMS";

export interface SendOtpDTO {
  phone: string;
  purpose: OtpPurpose;
}

export interface VerifyOtpDTO {
  phone: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface SessionUser {
  id: string;
  phone: string;
  firstName: string;
  lastName: string | null;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  phoneVerified: boolean;
}

export interface OtpProvider {
  send(phone: string, otp: string): Promise<void>;
}