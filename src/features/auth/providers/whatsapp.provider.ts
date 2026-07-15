import { BaseOtpProvider } from "./otp.provider";

export class WhatsAppProvider extends BaseOtpProvider {
  async send(): Promise<void> {
    throw new Error(
      "WhatsApp provider is not configured."
    );
  }
}