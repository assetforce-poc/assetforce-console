import { auth } from '@assetforce/auth/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const IMC_GRAPHQL_URL = process.env.IMC_GRAPHQL_URL || 'http://localhost:8082/graphql';

const DEFAULT_TIMEOUT = 30000;

const createErrorResponse = (error: unknown, defaultStatus: number) => {
  const isTimeout = error instanceof Error && error.name === 'AbortError';
  const status = isTimeout ? 504 : defaultStatus;
  const message = isTimeout ? 'Gateway Timeout' : 'Bad Gateway';
  return NextResponse.json({ error: message }, { status });
};

const handler = async (request: NextRequest): Promise<NextResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const { raw: session } = await auth.api.getSession({ headers: request.headers });

    const body = request.method !== 'GET' ? await request.text() : undefined;
    const url =
      request.method === 'GET' ? `${IMC_GRAPHQL_URL}?${new URL(request.url).searchParams.toString()}` : IMC_GRAPHQL_URL;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') ?? '',
    };

    if (session.accessToken) {
      headers.authorization = `Bearer ${session.accessToken}`;
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
    console.error('GraphQL IMC proxy error:', error);
    return createErrorResponse(error, 502);
  } finally {
    clearTimeout(timeoutId);
  }
};

export const GET = handler;
export const POST = handler;
