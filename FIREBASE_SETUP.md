# Firebase Phone Auth — Setup Guide

Login now uses **real Firebase Phone Auth** (actual SMS OTPs), wired into the
existing `/login` UI. Do this once before you deploy:

## 1. Create a Firebase project
1. Go to https://console.firebase.google.com → **Add project** → name it
   (e.g. `bachatmall`) → finish the wizard.

## 2. Enable Phone sign-in
1. In the left sidebar: **Build → Authentication → Get started**.
2. Under **Sign-in method**, enable **Phone**.
3. Under **Settings → Authorized domains**, add your production domain
   (e.g. `bachatmall.vercel.app`) — `localhost` is already allowed.

> Firebase's free (Spark) plan includes a small number of free SMS/month for
> testing. For production volume, upgrade to Blaze (pay-as-you-go).

### Test phone numbers (optional, recommended while developing)
In **Authentication → Sign-in method → Phone → Phone numbers for testing**,
add a fake number (e.g. `+91 9999999999`) with a fixed code (e.g. `123456`).
This lets you test the whole flow without burning real SMS or waiting for a
text message.

## 3. Get the client config (public keys)
1. **Project Settings** (gear icon) → **General** → scroll to **Your apps**.
2. Click the **Web** icon (`</>`) to register a web app if you haven't.
3. Copy the `firebaseConfig` values into your `.env`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

These are safe to expose in the browser — Firebase restricts them by
authorized domain, not secrecy.

## 4. Get the Admin (server-side) credentials
1. **Project Settings → Service accounts → Generate new private key**.
2. This downloads a JSON file. You have two options:
   - **Recommended (Vercel/hosted):** open the file, copy its entire
     contents, and paste them as a single line into the
     `FIREBASE_SERVICE_ACCOUNT_KEY` env var.
   - **Local dev:** save the file as `firebase-service-account.json` at the
     project root (same folder as `package.json`). It's already git-ignored
     — never commit it.

## 5. Test it
1. `npm run dev`, go to `/login`.
2. Enter a 10-digit number → **Send OTP**.
3. Enter the 6-digit code you receive by SMS (or your test code from step 2).
4. New numbers land on the "Tell us a bit about you" step; existing users go
   straight in.

## How it's wired into the code
- `src/lib/firebase.ts` — client SDK config.
- `src/lib/firebase-admin.ts` — server-side token verification (reads either
  `FIREBASE_SERVICE_ACCOUNT_KEY` or the local JSON file).
- `src/hooks/useAuth.ts` — `firebaseSendOtp` / `firebaseVerifyOtp` /
  `firebaseCompleteProfile` drive the whole flow from the client.
- `src/app/login/page.tsx` — the UI (unchanged look, now backed by Firebase).
- `src/app/api/auth/firebase/route.ts` — verifies the ID token, creates/updates
  the user, and sets the same session cookie the rest of the app uses.
- `src/app/api/auth/firebase-complete-profile/route.ts` — saves name/email for
  brand-new users right after their phone is verified.

## Troubleshooting
- **"Phone login isn't configured yet"** → the `NEXT_PUBLIC_FIREBASE_*` vars
  are missing/wrong, or Phone sign-in isn't enabled in step 2.
- **reCAPTCHA errors in the console** → make sure your domain is in
  **Authorized domains** (step 2.3).
- **"Firebase Admin isn't configured"** (server logs) → step 4 wasn't
  completed — OTP will send, but verification will fail.
