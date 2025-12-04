import type { HandlerContext, RouteHandler } from '../types';

/**
 * POST /api/auth/refresh - Refresh session tokens
 */
export const refreshHandler: RouteHandler = async ({ request, session, api }: HandlerContext) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const result = await api.refresh(session);

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' },
  });
};
