"use client";

import SessionProvider from "@/providers/SessionProvider";

/**
 * Root auth wrapper. Previously wired to NextAuth's <SessionProvider>,
 * which was non-functional (empty providers array + Google sign-in that
 * did nothing). The app's real auth is the custom phone-OTP + JWT cookie
 * flow in src/lib/session.ts, so this now wraps children with our own
 * SessionProvider instead.
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
