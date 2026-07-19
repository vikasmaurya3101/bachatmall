import { BaseOtpProvider } from "./otp.provider";

/**
 * Generic WhatsApp Business API OTP provider.
 * Configure WHATSAPP_API_URL / WHATSAPP_API_KEY in .env for your vendor
 * (e.g. Meta Cloud API, Gupshup, Twilio WhatsApp, etc). Adjust the
 * request body below to match your provider's exact payload shape.
 */
export class WhatsAppProvider extends BaseOtpProvider {
  async send(phone: string, otp: string): Promise<void> {
    const apiUrl = process.env.WHATSAPP_API_URL;
    const apiKey = process.env.WHATSAPP_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error("WhatsApp provider is not configured.");
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to: phone,
        type: "template",
        template: {
          name: "otp_verification",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text: otp }],
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `WhatsApp OTP send failed (${response.status}): ${errorText}`
      );
    }
  }
}

export const whatsappProvider = new WhatsAppProvider();
