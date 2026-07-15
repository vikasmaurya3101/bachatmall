import { BaseOtpProvider } from "./otp.provider";

export class MockOtpProvider extends BaseOtpProvider {
  async send(
    phone: string,
    otp: string
  ): Promise<void> {
    console.log("");
    console.log("========== MOCK OTP ==========");
    console.log(`Phone : ${phone}`);
    console.log(`OTP   : ${otp}`);
    console.log("==============================");
    console.log("");
  }
}