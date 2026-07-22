import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

/**
 * Firebase Admin is used server-side only, to verify the ID token the
 * client receives after a successful Firebase Phone Auth sign-in.
 *
 * Credentials can be provided in two ways (checked in this order):
 *  1. FIREBASE_SERVICE_ACCOUNT_KEY — the full service account JSON as a
 *     single-line env var (recommended for Vercel / hosted deployments).
 *  2. firebase-service-account.json — a file at the project root
 *     (handy for local development). Never commit this file.
 *
 * See FIREBASE_SETUP.md for step-by-step instructions.
 */
function loadServiceAccount() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (inline) {
    try {
      return JSON.parse(inline);
    } catch {
      console.error(
        "FIREBASE_SERVICE_ACCOUNT_KEY is set but isn't valid JSON."
      );
      return null;
    }
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("../../firebase-service-account.json");
  } catch {
    return null;
  }
}

let adminAuthInstance: ReturnType<typeof getAuth> | null = null;

if (!getApps().length) {
  const serviceAccount = loadServiceAccount();

  if (serviceAccount) {
    initializeApp({ credential: cert(serviceAccount) });
    adminAuthInstance = getAuth();
  } else {
    console.warn(
      "[firebase-admin] No service account configured — Firebase Phone Auth " +
        "verification will fail until FIREBASE_SERVICE_ACCOUNT_KEY (or " +
        "firebase-service-account.json) is set. See FIREBASE_SETUP.md."
    );
  }
} else {
  adminAuthInstance = getAuth();
}

/**
 * Throws a clear error at call-time (instead of at import-time) if Firebase
 * Admin hasn't been configured, so the rest of the app keeps working.
 */
export const adminAuth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(_target, prop) {
    if (!adminAuthInstance) {
      throw new Error(
        "Firebase Admin isn't configured. Add FIREBASE_SERVICE_ACCOUNT_KEY " +
          "to your environment (see FIREBASE_SETUP.md)."
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (adminAuthInstance as any)[prop];
  },
});
