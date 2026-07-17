import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";
import {
  OTP_BCRYPT_ROUNDS,
  OTP_EXPIRY_MINUTES,
  OTP_LENGTH,
} from "../constants/auth.constants";

const generator = customAlphabet(
  "0123456789",
  OTP_LENGTH
);

export function generateOtp() {
  return generator();
}

export async function hashOtp(
  otp: string
) {
  return bcrypt.hash(
    otp,
    OTP_BCRYPT_ROUNDS
  );
}

export async function compareOtp(
  otp: string,
  hash: string
) {
  return bcrypt.compare(
    otp,
    hash
  );
}

export function getExpiryDate() {
  return new Date(
    Date.now() +
      OTP_EXPIRY_MINUTES *
        60 *
        1000
  );
}