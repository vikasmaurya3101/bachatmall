"use client";

import { useEffect } from "react";
import { RecaptchaVerifier } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export default function RecaptchaContainer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(getFirebaseAuth(), "recaptcha-container", {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved automatically
        },
      });

      window.recaptchaVerifier.render();
    }
  }, []);

  return <div id="recaptcha-container" />;
}