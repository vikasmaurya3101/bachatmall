import { redirect } from "next/navigation";

/**
 * OTP verification happens inline on the /login page (phone -> otp ->
 * profile steps in one flow), so this route just redirects there.
 */
export default function VerifyPage() {
  redirect("/login");
}
