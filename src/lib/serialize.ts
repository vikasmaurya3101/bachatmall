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
export function serializeData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
