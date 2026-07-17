export interface SendOtpRequestDto {
  phone: string;
}

export interface VerifyOtpRequestDto {
  phone: string;
  otp: string;
}

export interface CompleteProfileDto {
  phone: string;
  firstName: string;
  lastName?: string;
}