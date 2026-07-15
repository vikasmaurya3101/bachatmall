import { OtpProvider } from "../types/auth.types";

export abstract class BaseOtpProvider
  implements OtpProvider
{
  abstract send(
    phone: string,
    otp: string
  ): Promise<void>;
}