# Razorpay Payments — Setup Guide

Checkout now offers **Cash on Delivery** or **Pay Online** (Razorpay — UPI,
cards, netbanking, wallets).

## 1. Create a Razorpay account
1. Sign up at https://dashboard.razorpay.com/signup.
2. You can start in **Test Mode** immediately — no KYC needed for testing.

## 2. Get your API keys
1. Dashboard → **Settings → API Keys** → **Generate Test Key**.
2. Copy the **Key Id** and **Key Secret** into `.env`:

```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

`RAZORPAY_KEY_SECRET` must stay server-side only — never prefix it with
`NEXT_PUBLIC_`. The Key Id is sent to the browser automatically by
`/api/payments/razorpay/create-order` when a payment starts, so you don't
need a separate public env var for it.

## 3. Test a payment
1. `npm run dev`, add something to the cart, go to `/checkout`.
2. Select an address, choose **Pay Online**, click **Pay & Place Order**.
3. In the Razorpay modal, use a [test card](https://razorpay.com/docs/payments/payments/test-card-upi-details/):
   - Card: `4111 1111 1111 1111`, any future expiry, any CVV, OTP `1111` — or
   - UPI: use the "success" test UPI id from the same page.
4. On success you're redirected to the order confirmation page, and the
   order's payment status is `PAID`.

## 4. Go live
1. Complete Razorpay's KYC/activation (Dashboard → Account & Settings).
2. Switch **Test Mode** off, generate **Live keys**, and swap them into your
   production environment variables (e.g. in Vercel → Project → Settings →
   Environment Variables).

## How it's wired into the code
- `src/lib/razorpay.ts` — server-side Razorpay SDK client.
- `src/app/api/payments/razorpay/create-order/route.ts` — creates a Razorpay
  order sized to the user's current cart total.
- `src/app/checkout/page.tsx` — loads `checkout.js`, opens the Razorpay modal,
  and on success calls `/api/checkout` with the payment result.
- `src/features/checkout/service/checkout.service.ts` — **verifies the
  HMAC-SHA256 signature server-side** before marking the order as paid (this
  is what actually proves the payment is genuine — never trust the client
  alone). Verified orders are stored with `razorpayOrderId`,
  `razorpayPaymentId` and `razorpaySignature` on the `Payment` record.

## Notes
- Amounts are sent to Razorpay in paise (`₹1 = 100`); the code already
  handles this conversion.
- If you'd like webhook-based reconciliation (recommended for production, in
  case a user closes the tab mid-payment) add a
  `/api/payments/razorpay/webhook` route that verifies the
  `X-Razorpay-Signature` header against `RAZORPAY_WEBHOOK_SECRET` — happy to
  add this next if you want it before going fully live.
