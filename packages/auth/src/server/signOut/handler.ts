import type { HandlerContext, RouteHandler } from '../types';

/**
 * POST /api/auth/signout - Sign out current session
 */
export const signoutHandler: RouteHandler = async ({ request, session, api }: HandlerContext) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  await api.signOut(session);

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
