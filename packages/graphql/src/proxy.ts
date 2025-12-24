import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Function to extract access token from request
 * Returns token string or null if not available
 */
export type TokenExtractor = (request: NextRequest) => Promise<string | null>;

export interface GraphQLProxyOptions {
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Headers to forward from client request (default: ['authorization', 'cookie']) */
  forwardHeaders?: string[];
  /**
   * Function to extract access token from request for Authorization header.
   * If provided and returns a token, it will be added as "Bearer <token>".
   * This is useful for extracting JWT from session cookies.
   */
  getAccessToken?: TokenExtractor;
}

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_FORWARD_HEADERS = ['authorization', 'cookie'];

const filterHeaders = (headers: Headers, allowList: string[]): Record<string, string> =>
  Object.fromEntries(Array.from(headers.entries()).filter(([key]) => allowList.includes(key.toLowerCase())));

const createErrorResponse = (error: unknown, defaultStatus: number) => {
  const isTimeout = error instanceof Error && error.name === 'AbortError';
  const status = isTimeout ? 504 : defaultStatus;
  const message = isTimeout ? 'Gateway Timeout' : 'Bad Gateway';
  return NextResponse.json({ error: message }, { status });
};

/**
 * Creates a GraphQL proxy handler for Next.js API routes
 *
 * @example
 * ```ts
 * // Basic proxy (no auth)
 * const proxy = createGraphQLProxy(process.env.AAC_GRAPHQL_URL!);
 *
 * // Authenticated proxy (with session token)
 * import { auth } from '@assetforce/auth/server';
 *
 * const proxy = createGraphQLProxy(process.env.SGC_GRAPHQL_URL!, {
 *   getAccessToken: async (request) => {
 *     const { raw } = await auth.api.getSession({ headers: request.headers });
 *     return raw.accessToken || null;
 *   },
 * });
 * ```
 */
export const createGraphQLProxy = (targetUrl: string, options?: GraphQLProxyOptions) => {
  if (!targetUrl) throw new Error('GraphQL proxy targetUrl is required');

  const timeout = options?.timeout ?? DEFAULT_TIMEOUT;
  const forwardHeaders = options?.forwardHeaders ?? DEFAULT_FORWARD_HEADERS;
  const getAccessToken = options?.getAccessToken;

  return async (request: NextRequest): Promise<NextResponse> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const body = request.method !== 'GET' ? await request.text() : undefined;
      const url = request.method === 'GET' ? `${targetUrl}?${new URL(request.url).searchParams.toString()}` : targetUrl;

      // Build headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...filterHeaders(request.headers, forwardHeaders),
      };

      // Extract and add Authorization header if token extractor is provided
      if (getAccessToken) {
        const token = await getAccessToken(request);
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(url, {
        method: request.method,
        headers,
        body,
        signal: controller.signal,
      });

      return new NextResponse(await response.text(), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('GraphQL proxy error:', error);
      return createErrorResponse(error, 502);
    } finally {
      clearTimeout(timeoutId);
    }
  };
};
