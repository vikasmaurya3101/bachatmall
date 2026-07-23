"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

/**
 * middleware.ts redirects unauthenticated visits to protected routes
 * (/cart, /profile, /checkout, /orders, /seller) back to "/" with
 * ?login=required&redirect=<original path>. Nothing was reading those
 * params before, so the user was silently bounced home with no feedback.
 * This component shows a toast and then cleans the URL.
 */
export default function LoginRequiredNotice() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get("login") === "required") {
      toast.error("Please login to continue.");

      const params = new URLSearchParams(searchParams.toString());
      params.delete("login");
      params.delete("redirect");

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
}
