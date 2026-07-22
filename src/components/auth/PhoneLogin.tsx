"use client";

import { useState } from "react";
import { signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import RecaptchaContainer from "./RecaptchaVerifier";

interface PhoneLoginProps {
  onOtpSent: (confirmation: ConfirmationResult, phone: string) => void;
}

export default function PhoneLogin({
  onOtpSent,
}: PhoneLoginProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    try {
      setLoading(true);

      if (!phone.startsWith("+")) {
        alert("Enter phone number with country code.\nExample: +919876543210");
        return;
      }

      const appVerifier = window.recaptchaVerifier;

      if (!appVerifier) {
        alert("reCAPTCHA is not initialized.");
        return;
      }

      const confirmation = await signInWithPhoneNumber(
       getFirebaseAuth(),
        phone,
        appVerifier
      );

      onOtpSent(confirmation, phone);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RecaptchaContainer />

      <div className="space-y-4">
        <input
          type="tel"
          placeholder="+919876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border p-3"
        />

        <button
          onClick={sendOtp}
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 text-white"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
    </>
  );
}