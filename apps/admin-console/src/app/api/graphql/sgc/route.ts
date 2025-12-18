import { auth } from '@assetforce/auth/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const SGC_GRAPHQL_URL = process.env.SGC_GRAPHQL_URL || 'http://localhost:8083/graphql';

async function handler(request: NextRequest) {
  try {
    // Get session and extract access token
    const { raw: sessionData } = await auth.api.getSession({ headers: request.headers });
    const accessToken = sessionData.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Read request body
    const body = request.method !== 'GET' ? await request.text() : undefined;
    const url = request.method === 'GET' ? `${SGC_GRAPHQL_URL}?${new URL(request.url).searchParams.toString()}` : SGC_GRAPHQL_URL;

    // Forward to SGC with JWT token
    const response = await fetch(url, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body,
    });

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('SGC GraphQL proxy error:', error);
    return NextResponse.json({ error: 'Bad Gateway' }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
