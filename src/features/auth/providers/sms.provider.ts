import { BaseOtpProvider } from "./otp.provider";

export class SmsProvider extends BaseOtpProvider {
  async send(): Promise<void> {
    throw new Error(
      "SMS provider is not configured."
    );
  }
}