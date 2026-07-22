"use client";

import { useState } from "react";
import { ConfirmationResult } from "firebase/auth";

interface Props {
  confirmation: ConfirmationResult;
  phone: string;
  onVerified: (idToken: string) => void;
}

export default function OtpVerification({
  confirmation,
  phone,
  onVerified,
}: Props) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    try {
      setLoading(true);

      const result = await confirmation.confirm(otp);

      const idToken = await result.user.getIdToken();

      onVerified(idToken);
    } catch (error: any) {
      console.error(error);
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        OTP sent to <strong>{phone}</strong>
      </p>

      <input
        type="text"
        maxLength={6}
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full rounded-lg border p-3"
      />

      <button
        onClick={verifyOtp}
        disabled={loading}
        className="w-full rounded-lg bg-green-600 p-3 text-white"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
}