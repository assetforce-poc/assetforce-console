import type { HandlerContext, RouteHandler } from '../types';

/**
 * POST /api/auth/forgot-password - Request password reset email
 */
export const forgotPasswordHandler: RouteHandler = async ({ request, api }: HandlerContext) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.email) {
    return new Response(JSON.stringify({ success: false, error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await api.forgotPassword(body.email);

  // Always return 200 OK to prevent email enumeration
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * POST /api/auth/reset-password - Reset password with token
 */
export const resetPasswordHandler: RouteHandler = async ({ request, api }: HandlerContext) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let body: { token?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.token) {
    return new Response(JSON.stringify({ success: false, error: 'Token is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.newPassword) {
    return new Response(JSON.stringify({ success: false, error: 'New password is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await api.resetPassword(body.token, body.newPassword);

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * POST /api/auth/change-password - Change password for authenticated user
 */
export const changePasswordHandler: RouteHandler = async ({ request, session, api }: HandlerContext) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.currentPassword) {
    return new Response(JSON.stringify({ success: false, error: 'Current password is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.newPassword) {
    return new Response(JSON.stringify({ success: false, error: 'New password is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await api.changePassword(body.currentPassword, body.newPassword, session);

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : result.error === 'Not authenticated' ? 401 : 400,
    headers: { 'Content-Type': 'application/json' },
  });
};
