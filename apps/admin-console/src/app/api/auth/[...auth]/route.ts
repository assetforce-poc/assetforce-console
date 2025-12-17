import { auth } from '@assetforce/auth/server';

/**
 * Auth API Route Handler
 *
 * Handles all authentication routes via the auth package:
 * - POST /api/auth/signin
 * - POST /api/auth/signout
 * - GET  /api/auth/session
 * - POST /api/auth/select-tenant
 * - POST /api/auth/refresh
 */
export async function GET(request: Request) {
  return auth.handler(request);
}

export async function POST(request: Request) {
  return auth.handler(request);
}
