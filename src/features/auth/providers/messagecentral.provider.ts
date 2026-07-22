/**
 * Message Central "VerifyNow" OTP provider.
 *
 * Unlike the other providers in this folder (which send a message
 * containing an OTP *we* generated), Message Central generates and
 * validates the OTP on their end via a two-step verification API. This
 * is the specific product of theirs that's exempt from India's DLT
 * registration requirement.
 *
 * Params below are matched exactly to Message Central's current
 * "VerifyNow — A Quick Onboarding Guide" PDF (2026) — earlier attempts
 * that included `customerId` and `type=SMS` on the /send call hit their
 * old/discontinued platform instead. See MESSAGECENTRAL_SETUP.md.
 */

const BASE_URL = "https://cpaas.messagecentral.com";

let cachedToken: { value: string; fetchedAt: number } | null = null;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 6; // refresh every 6h to be safe

/**
 * Returns a usable authToken. If MESSAGECENTRAL_AUTH_TOKEN is set (the
 * ready-made token from the dashboard's Developer Guide), that's used
 * directly. Otherwise, if MESSAGECENTRAL_CUSTOMER_ID + _PASSWORD are set,
 * a fresh token is generated (and cached) via Message Central's token API.
 */
async function getAuthToken(): Promise<string> {
  const staticToken = process.env.MESSAGECENTRAL_AUTH_TOKEN;
  if (staticToken) return staticToken;

  const customerId = process.env.MESSAGECENTRAL_CUSTOMER_ID;
  const password = process.env.MESSAGECENTRAL_PASSWORD;

  if (!customerId || !password) {
    throw new Error(
      "Message Central isn't configured. Set MESSAGECENTRAL_AUTH_TOKEN " +
        "(from the dashboard), or MESSAGECENTRAL_CUSTOMER_ID + " +
        "MESSAGECENTRAL_PASSWORD so a token can be generated automatically " +
        "— see MESSAGECENTRAL_SETUP.md."
    );
  }

  if (cachedToken && Date.now() - cachedToken.fetchedAt < TOKEN_TTL_MS) {
    return cachedToken.value;
  }

  const key = Buffer.from(password, "utf-8").toString("base64");

  const url =
    `${BASE_URL}/auth/v1/authentication/token` +
    `?customerId=${encodeURIComponent(customerId)}` +
    `&key=${encodeURIComponent(key)}&scope=NEW&country=91`;

  const response = await fetch(url, {
    method: "GET",
    headers: { accept: "*/*" },
  });

  const json = await response.json().catch(() => null);
  const token = json?.token ?? json?.data?.token ?? json?.authToken;

  if (!response.ok || !token) {
    throw new Error(
      `Message Central token generation failed (${response.status}): ` +
        (json?.message ?? "Unknown error")
    );
  }

  cachedToken = { value: token, fetchedAt: Date.now() };
  return token;
}

export const messageCentralProvider = {
  /**
   * Asks Message Central to generate and send an OTP to the given
   * 10-digit Indian mobile number. Returns their verificationId, which
   * must be passed back into verifyOtp() to check the code later.
   */
  async sendOtp(phone: string): Promise<string> {
    const authToken = await getAuthToken();

    const url =
      `${BASE_URL}/verification/v3/send` +
      `?countryCode=91&flowType=SMS&mobileNumber=${encodeURIComponent(phone)}` +
      `&otpLength=6`;

    const response = await fetch(url, {
      method: "POST",
      headers: { authToken },
    });

    const json = await response.json().catch(() => null);

    if (!response.ok || !json?.data?.verificationId) {
      throw new Error(
        `Message Central OTP send failed (${response.status}): ` +
          (json?.message ?? json?.data?.errorMessage ?? "Unknown error")
      );
    }

    return String(json.data.verificationId);
  },

  /**
   * Validates the code the user typed against the verificationId
   * returned by sendOtp().
   */
  async verifyOtp(verificationId: string, code: string): Promise<boolean> {
    const authToken = await getAuthToken();

    const url =
      `${BASE_URL}/verification/v3/validateOtp` +
      `?verificationId=${encodeURIComponent(verificationId)}` +
      `&code=${encodeURIComponent(code)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { authToken },
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        `Message Central OTP verification failed (${response.status}): ` +
          (json?.message ?? "Unknown error")
      );
    }

    // Message Central returns data.verificationStatus === "VERIFICATION_COMPLETED" on success
    return json?.data?.verificationStatus === "VERIFICATION_COMPLETED";
  },
};