import type { Decimal } from "@prisma/client/runtime/library";

/**
 * Converts a Prisma query result into plain JSON-safe data (Decimal ->
 * string, Date -> ISO string, etc). Required before passing data fetched
 * directly via Prisma in a Server Component down into any "use client"
 * component — React can't serialize class instances like Decimal across
 * that boundary ("Only plain objects can be passed to Client Components").
 *
 * Not needed for data returned from API routes — NextResponse.json()
 * already does this automatically over HTTP.
 */
type Serialized<T> = T extends Decimal
  ? string
  : T extends Date
  ? string
  : T extends (infer U)[]
  ? Serialized<U>[]
  : T extends object
  ? { [K in keyof T]: Serialized<T[K]> }
  : T;

export function serializeData<T>(data: T): Serialized<T> {
  return JSON.parse(JSON.stringify(data));
}