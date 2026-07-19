"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type Step = "phone" | "otp" | "profile";

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

  const { sendOtp, verifyOtp, completeProfile, isSubmitting, error } =
    useAuth();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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

    const result = await verifyOtp(phone.replace(/\D/g, ""), otp.trim());

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

    const result = await completeProfile({
      phone: phone.replace(/\D/g, ""),
      firstName,
      lastName: lastName || undefined,
    });

    if (result.success) {
      router.push(redirectTo);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_20px_50px_-15px_rgba(214,38,111,0.25)]">
        <h1 className="text-center text-2xl font-extrabold text-brand">
          BachatMall
        </h1>

        <p className="mt-1 text-center text-sm text-gray-500">
          {step === "phone" && "Login or sign up with your phone number"}
          {step === "otp" && `Enter the OTP sent to ${phone}`}
          {step === "profile" && "Tell us a bit about you"}
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {step === "phone" && (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <input
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-brand"
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full rounded-lg border px-4 py-3 text-center tracking-widest outline-none focus:border-brand"
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
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
          </form>
        )}

        {step === "profile" && (
          <form onSubmit={handleCompleteProfile} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-brand"
              required
            />

            <input
              type="text"
              placeholder="Last name (optional)"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-brand"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
