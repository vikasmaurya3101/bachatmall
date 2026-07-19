import { NextResponse } from "next/server";

/**
 * Standard JSON response shape used across API routes:
 * { success, message?, data? }
 */
export function successResponse<T>(
  data?: T,
  message?: string,
  status = 200
) {
  return NextResponse.json(
    { success: true, message, data },
    { status }
  );
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: unknown
) {
  return NextResponse.json(
    { success: false, message, errors },
    { status }
  );
}

/**
 * Convenience wrapper for route handlers: runs the handler and turns
 * any thrown Error into a consistent error response instead of a raw
 * 500 with an unhandled exception.
 */
export async function withErrorHandling<T>(
  handler: () => Promise<T>
): Promise<T | ReturnType<typeof errorResponse>> {
  try {
    return await handler();
  } catch (error) {
    console.error(error);

    return errorResponse(
      error instanceof Error ? error.message : "Something went wrong.",
      error instanceof Error && error.message === "Not authorized." ? 403 : 500
    );
  }
}
