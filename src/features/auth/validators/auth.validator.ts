import { z } from "zod";

export const sendOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/),
  purpose: z.enum([
    "LOGIN",
    "SIGNUP",
    "RESET",
  ]),
});

export const verifyOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/),
  otp: z
    .string()
    .length(6),
  purpose: z.enum([
    "LOGIN",
    "SIGNUP",
    "RESET",
  ]),
});

export type SendOtpInput =
  z.infer<typeof sendOtpSchema>;

export type VerifyOtpInput =
  z.infer<typeof verifyOtpSchema>;