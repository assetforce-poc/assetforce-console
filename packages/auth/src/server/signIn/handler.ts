import type { HandlerContext, RouteHandler } from '../types';

/**
 * POST /api/auth/signin - Sign in with credentials
 */
export const signinHandler: RouteHandler = async ({ request, session, api }: HandlerContext) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.username || !body.password) {
    return new Response(JSON.stringify({ success: false, error: 'Username and password are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await api.signIn({ username: body.username, password: body.password }, session);

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 401,
    headers: { 'Content-Type': 'application/json' },
  });
};
