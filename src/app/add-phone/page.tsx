"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "@/providers/SessionProvider";

export default function AddPhonePage() {
  return (
    <Suspense fallback={null}>
      <AddPhoneForm />
    </Suspense>
  );
}

function AddPhoneForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const { isAuthenticated, isLoading: isSessionLoading } = useSession();
  const { sendOtp, addPhone, isSubmitting, error } = useAuth();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();

    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) return;

    const result = await sendOtp(digitsOnly);
    if (result.success) setStep("otp");
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();

    if (otp.trim().length < 4) return;

    const result = await addPhone(phone.replace(/\D/g, ""), otp.trim());
    if (result.success) router.push(redirectTo);
  }

  if (isSessionLoading) return null;

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50 px-4">
        <p className="text-gray-600">
          Please{" "}
          <a href="/login" className="text-brand underline">
            login
          </a>{" "}
          first.
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_20px_50px_-15px_rgba(214,38,111,0.25)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
          <Phone size={22} className="text-brand" />
        </div>

        <h1 className="mt-4 text-center text-xl font-extrabold text-gray-900">
          Add your phone number
        </h1>

        <p className="mt-1 text-center text-sm text-gray-500">
          {step === "phone"
            ? "We use this for order updates and to help you log in faster next time."
            : `Enter the OTP sent to ${phone}`}
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
              className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 outline-none focus:border-brand"
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>

            <button
              type="button"
              onClick={() => router.push(redirectTo)}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
            >
              Skip for now
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-center tracking-widest outline-none focus:border-brand"
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {isSubmitting ? "Verifying..." : "Verify & Continue"}
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
      </div>
    </main>
  );
}
