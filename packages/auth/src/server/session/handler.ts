import type { HandlerContext, RouteHandler } from '../types';

/**
 * GET /api/auth/session - Get current session
 */
export const sessionHandler: RouteHandler = async ({ request, clientSession }: HandlerContext) => {
  if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });

  return new Response(JSON.stringify({ session: clientSession }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
