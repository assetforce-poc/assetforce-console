import { auth } from '@assetforce/auth/server';

/**
 * Auth API Route Handler
 *
 * Handles all authentication endpoints:
 * - POST /api/auth/signin     - Sign in with credentials
 * - POST /api/auth/signout    - Sign out
 * - POST /api/auth/select-tenant - Select tenant (multi-tenant)
 * - POST /api/auth/refresh    - Refresh session
 * - GET  /api/auth/session    - Get current session
 */
export const GET = auth.handler;
export const POST = auth.handler;
