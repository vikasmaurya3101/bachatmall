"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";

interface ApiResult<T = unknown> {
  success: boolean;
  message?: string;
  isNewUser?: boolean;
  data?: T;
}

async function postJson<T = unknown>(
  url: string,
  body: unknown
): Promise<ApiResult<T>> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
}

/**
 * Client hook wrapping the app's phone + OTP authentication flow:
 * sendOtp -> verifyOtp -> (completeProfile if new user) -> logout
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, refresh, setUser } =
    useSession();

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = useCallback(async (phone: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await postJson("/api/auth/send-otp", { phone });

      if (!result.success) {
        setError(result.message ?? "Unable to send OTP.");
      }

      return result;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const verifyOtp = useCallback(
    async (phone: string, otp: string) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await postJson<{
          id: string;
          phone: string;
          firstName: string | null;
          lastName: string | null;
          role: "CUSTOMER" | "SELLER" | "ADMIN";
          phoneVerified: boolean;
        }>("/api/auth/verify-otp", { phone, otp });

        if (!result.success) {
          setError(result.message ?? "Invalid OTP.");
          return result;
        }

        if (!result.isNewUser && result.data) {
          setUser(result.data);
        } else {
          await refresh();
        }

        return result;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refresh, setUser]
  );

  const completeProfile = useCallback(
    async (data: {
      phone: string;
      firstName: string;
      lastName?: string;
    }) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await postJson(
          "/api/auth/complete-profile",
          data
        );

        if (!result.success) {
          setError(result.message ?? "Unable to complete profile.");
          return result;
        }

        await refresh();

        return result;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refresh]
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }, [router, setUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isSubmitting,
    error,
    sendOtp,
    verifyOtp,
    completeProfile,
    logout,
  };
}

export default useAuth;
