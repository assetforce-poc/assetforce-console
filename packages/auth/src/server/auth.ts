import { createAuth } from './createAuth';

/**
 * auth - Pre-configured auth instance
 *
 * Automatically configured using environment variables.
 *
 * Required environment variables:
 * - AUTH_ENDPOINT: Auth backend API endpoint
 * - AUTH_SECRET: Secret for session encryption (min 32 characters)
 *
 * Optional:
 * - NEXT_PUBLIC_APP_URL: Application URL
 *
 * @example
 * ```typescript
 * import { auth } from '@assetforce/auth/server';
 *
 * // In API Route
 * export async function GET(request: Request) {
 *   const { session } = await auth.api.getSession({ headers: request.headers });
 *   if (!session) {
 *     return new Response('Unauthorized', { status: 401 });
 *   }
 *   // ...
 * }
 *
 * // In Server Component
 * import { cookies } from 'next/headers';
 *
 * async function Page() {
 *   const { session } = await auth.api.getSessionFromCookies(cookies);
 *   // ...
 * }
 * ```
 */
export const auth = createAuth({
  endpoint: process.env.AUTH_ENDPOINT || 'http://localhost:8081/graphql',
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  session: {
    password: process.env.AUTH_SECRET || '',
  },
});
