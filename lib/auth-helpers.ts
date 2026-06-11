import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

interface AuthUser {
  id: string;
  email: string;
}

/**
 * Extract authenticated user from request.
 * Checks Authorization header (Bearer token) and cookies.
 * Used in API route handlers (Node.js runtime).
 */
export function getAuthUser(request: NextRequest): AuthUser | null {
  let token: string | undefined;

  // Check Authorization header first
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Fall back to cookie
  if (!token) {
    token = request.cookies.get("token")?.value;
  }

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload || !payload.sub) {
    return null;
  }

  return {
    id: payload.sub as string,
    email: payload.email as string,
  };
}
