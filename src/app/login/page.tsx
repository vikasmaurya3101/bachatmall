"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/shared/Logo";

type Step = "phone" | "otp" | "profile";

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_login_failed: "Google sign-in failed. Please try again.",
  google_not_configured: "Google sign-in isn't available right now.",
  google_no_email:
    "Your Google account needs a verified email to sign in.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const googleError = searchParams.get("error");

  const {
    // Using the legacy phone OTP flow (now backed by Message Central)
    // instead of Firebase Phone Auth, since that needs Firebase's Blaze
    // billing plan enabled. Swap these three back to firebaseSendOtp /
    // firebaseVerifyOtp / firebaseCompleteProfile once that's set up —
    // see FIREBASE_SETUP.md.
    sendOtp,
    verifyOtp,
    completeProfile,
    loginWithGoogle,
    isSubmitting,
    error,
  } = useAuth();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (googleError) {
      setLocalError(
        GOOGLE_ERROR_MESSAGES[googleError] ?? "Something went wrong."
      );
    }
  }, [googleError]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();

    const digitsOnly = phone.replace(/\D/g, "");

    if (digitsOnly.length < 10) return;

    const result = await sendOtp(digitsOnly);

    if (result.success) {
      setStep("otp");
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();

    if (otp.trim().length < 4) return;

    const digitsOnly = phone.replace(/\D/g, "");
    const result = await verifyOtp(digitsOnly, otp.trim());

    if (!result.success) return;

    if (result.isNewUser) {
      setStep("profile");
    } else {
      router.push(redirectTo);
    }
  }

  async function handleCompleteProfile(e: React.FormEvent) {
    e.preventDefault();

    if (!firstName.trim()) return;

    const digitsOnly = phone.replace(/\D/g, "");
    const result = await completeProfile({
      phone: digitsOnly,
      firstName,
      lastName: lastName || undefined,
      email: email || undefined,
    });

    if (result.success) {
      router.push(redirectTo);
    }
  }

  const displayError = error || localError;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50 px-4 py-10">
      {/* Firebase's invisible reCAPTCHA mounts here — required for Phone Auth */}
      <div id="firebase-recaptcha-container" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_20px_50px_-15px_rgba(214,38,111,0.25)]"
      >
        <div className="flex justify-center">
          <Logo size={52} showText={false} />
        </div>

        <h1 className="mt-4 text-center text-2xl font-extrabold text-brand">
          Shopka
        </h1>

        <p className="mt-1 text-center text-sm text-gray-500">
          {step === "phone" && "Login or sign up to continue"}
          {step === "otp" && `Enter the OTP sent to +91 ${phone}`}
          {step === "profile" && "Tell us a bit about you"}
        </p>

        <AnimatePresence>
          {displayError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {displayError}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                onClick={() => loginWithGoogle(redirectTo)}
                className="tap-shrink mt-6 flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-medium text-gray-400">
                  OR USE PHONE NUMBER
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="flex items-center rounded-lg border px-4 py-3 focus-within:border-brand">
                  <span className="mr-2 text-sm font-medium text-gray-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    className="w-full outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="tap-shrink w-full rounded-lg bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send OTP"}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
                  <ShieldCheck size={13} className="text-brand" />
                  Verified securely via SMS OTP
                </p>
              </form>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleVerifyOtp}
              className="mt-6 space-y-4"
            >
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full rounded-lg border px-4 py-3 text-center tracking-widest outline-none focus:border-brand"
                required
                autoFocus
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="tap-shrink w-full rounded-lg bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => setStep("phone")}
                className="w-full text-center text-sm text-gray-500 hover:text-brand"
              >
                Change phone number
              </button>
            </motion.form>
          )}

          {step === "profile" && (
            <motion.form
              key="profile"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleCompleteProfile}
              className="mt-6 space-y-4"
            >
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-brand"
                required
                autoFocus
              />

              <input
                type="text"
                placeholder="Last name (optional)"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-brand"
              />

              <div>
                <label
                  htmlFor="signup-email"
                  className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700"
                >
                  <Mail size={15} className="text-brand" />
                  Email <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-brand-100 bg-brand-50/40 px-4 py-3 outline-none transition focus:border-brand focus:bg-white"
                />
                <p className="mt-1.5 text-xs text-gray-400">
                  For order receipts and account recovery.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="tap-shrink w-full rounded-lg bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Continue"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5C29.6 35.1 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.5 35.9 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}
