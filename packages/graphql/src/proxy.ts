import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

export interface GraphQLProxyOptions {
  timeout?: number;
  forwardHeaders?: string[];
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
 * // app/api/graphql/route.ts
 * import { createGraphQLProxy } from '@assetforce/graphql';
 *
 * const proxy = createGraphQLProxy(process.env.AAC_GRAPHQL_URL!);
 * export const GET = proxy;
 * export const POST = proxy;
 * ```
 */
export const createGraphQLProxy = (targetUrl: string, options?: GraphQLProxyOptions) => {
  if (!targetUrl) throw new Error('GraphQL proxy targetUrl is required');

  const timeout = options?.timeout ?? DEFAULT_TIMEOUT;
  const forwardHeaders = options?.forwardHeaders ?? DEFAULT_FORWARD_HEADERS;

  return async (request: NextRequest): Promise<NextResponse> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const body = request.method !== 'GET' ? await request.text() : undefined;
      const url = request.method === 'GET' ? `${targetUrl}?${new URL(request.url).searchParams.toString()}` : targetUrl;

      const response = await fetch(url, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          ...filterHeaders(request.headers, forwardHeaders),
        },
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
