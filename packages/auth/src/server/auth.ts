import { createAuth } from './createAuth';

/**
 * auth - Pre-configured auth instance
 *
 * Automatically configured using environment variables, suitable for most scenarios
 *
 * @example
 * ```typescript
 * import { auth } from '@assetforce/auth';
 *
 * // In API Route
 * export async function GET(request: Request) {
 *   const session = await auth.api.getSession({ headers: request.headers });
 *   // ...
 * }
 * ```
 */
export const auth = createAuth({
  aacEndpoint: process.env.AAC_GRAPHQL_ENDPOINT || 'http://localhost:8081/graphql',
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
});
