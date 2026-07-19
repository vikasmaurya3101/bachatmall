import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve conflicting Tailwind
 * utility classes (e.g. cn("p-2", condition && "p-4") -> "p-4").
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncate a string to a maximum length, appending an ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

/**
 * Simple debounce helper for use outside of React (e.g. plain
 * event handlers). For React components, prefer useDebounce.
 */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delayMs = 300
) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delayMs);
  };
}

/**
 * Build a plain query string from an object, skipping undefined/null/empty
 * values. Booleans and numbers are stringified.
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/**
 * Get initials from a name (e.g. "John Doe" -> "JD"), useful for
 * avatar placeholders.
 */
export function getInitials(
  firstName?: string | null,
  lastName?: string | null
): string {
  const first = firstName?.trim()?.[0] ?? "";
  const last = lastName?.trim()?.[0] ?? "";
  const initials = `${first}${last}`.toUpperCase();
  return initials || "U";
}

/**
 * Basic Indian phone number validation (10 digits, optionally
 * prefixed with +91 / 91 / 0).
 */
export function isValidIndianPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, "");
  const normalized = digitsOnly.replace(/^(91|0)/, "");
  return /^[6-9]\d{9}$/.test(normalized);
}

export function normalizePhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.replace(/^(91|0)/, "").slice(-10);
}
