import type { HandlerContext, RouteHandler, SessionWithPendingSubject } from '../types';

/**
 * POST /api/auth/select-tenant - Select tenant for multi-tenant scenario
 */
export const selectTenantHandler: RouteHandler = async ({ request, session, api }: HandlerContext) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let body: { tenantId?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.tenantId) {
    return new Response(JSON.stringify({ success: false, error: 'Tenant ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const pendingSubject = (session as SessionWithPendingSubject)._pendingSubject;

  if (!pendingSubject) {
    return new Response(JSON.stringify({ success: false, error: 'No pending subject' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await api.selectTenant(pendingSubject, body.tenantId, session);

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' },
  });
};
