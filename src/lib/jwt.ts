import jwt, { type SignOptions, type JwtPayload } from "jsonwebtoken";

/**
 * General-purpose JWT signing/verification helper, distinct from
 * src/lib/session.ts (which handles the httpOnly session cookie via
 * `jose`). Use this for stateless tokens such as email verification
 * links, password reset links, or signed upload tokens.
 */

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error(
      "Missing NEXTAUTH_SECRET environment variable required to sign JWTs."
    );
  }

  return secret;
}

export function signToken(
  payload: Record<string, unknown>,
  options?: SignOptions
): string {
  return jwt.sign(payload, getSecret(), {
    expiresIn: "1d",
    ...options,
  });
}

export function verifyToken<T extends JwtPayload = JwtPayload>(
  token: string
): T | null {
  try {
    return jwt.verify(token, getSecret()) as T;
  } catch {
    return null;
  }
}

export function decodeToken<T extends JwtPayload = JwtPayload>(
  token: string
): T | null {
  return jwt.decode(token) as T | null;
}
