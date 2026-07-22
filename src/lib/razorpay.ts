import Razorpay from "razorpay";

/**
 * Server-side Razorpay client. Never import this from a client component —
 * it uses the secret key.
 *
 * Get your keys from https://dashboard.razorpay.com/app/keys
 * (use the Test Mode keys while developing).
 */
let instance: Razorpay | null = null;

export function getRazorpayInstance() {
  if (instance) return instance;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay isn't configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET " +
        "to your environment (see RAZORPAY_SETUP.md)."
    );
  }

  instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return instance;
}
