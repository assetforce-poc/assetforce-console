import type { IronSession, SessionOptions } from 'iron-session';

import { type AuthClient, createAACClient } from '../internal/aac';
import { buildSessionOptions, getSessionFromCookies, getSessionFromHeaders } from '../internal/session';
import type { AuthConfig, Session, SessionData } from '../types';
import { HANDLERS } from './handlers';
import { createRefresh } from './refresh/api';
import { createSelectTenant } from './selectTenant/api';
import { createSignIn } from './signIn/api';
import { createSignOut } from './signOut/api';
import type { RefreshResult, RouteKey, SelectTenantResult, SignInCredentials, SignInResult } from './types';

/**
 * AuthInstance - Auth instance interface
 */
export interface AuthInstance {
  /** Session options for iron-session */
  sessionOptions: SessionOptions;

  /** Auth backend client (can be swapped for non-AAC implementations) */
  authClient: AuthClient;

  /** API methods */
  api: {
    /** Get current session from request headers */
    getSession: (options: { headers: Headers }) => Promise<{ session: Session | null; raw: IronSession<SessionData> }>;

    /** Get session using Next.js cookies() function */
    getSessionFromCookies: (
      cookies: () => Promise<{
        get: (name: string) => { name: string; value: string } | undefined;
        set: (name: string, value: string, options?: unknown) => void;
      }>
    ) => Promise<{ session: Session | null; raw: IronSession<SessionData> }>;

    /** Sign in with credentials */
    signIn: (credentials: SignInCredentials, session: IronSession<SessionData>) => Promise<SignInResult>;

    /** Select tenant (for multi-tenant scenarios) */
    selectTenant: (subject: string, tenantId: string, session: IronSession<SessionData>) => Promise<SelectTenantResult>;

    /** Sign out */
    signOut: (session: IronSession<SessionData>) => Promise<void>;

    /** Refresh session tokens */
    refresh: (session: IronSession<SessionData>) => Promise<RefreshResult>;
  };

  /** Handler for API routes */
  handler: (request: Request) => Promise<Response>;
}

/**
 * createAuth - Create auth instance with iron-session + AAC
 *
 * @param config - Authentication configuration
 * @returns Auth instance
 *
 * @example
 * ```typescript
 * import { createAuth } from '@assetforce/auth/server';
 *
 * export const auth = createAuth({
 *   endpoint: process.env.AUTH_ENDPOINT!,
 *   session: {
 *     password: process.env.AUTH_SECRET!,
 *   },
 * });
 * ```
 */
export const createAuth = (config: AuthConfig): AuthInstance => {
  const sessionOptions = buildSessionOptions(config);
  const authClient = createAACClient({ endpoint: config.endpoint });

  // Create API methods
  const signIn = createSignIn(authClient);
  const selectTenant = createSelectTenant(authClient);
  const signOut = createSignOut(authClient);
  const refresh = createRefresh(authClient);

  const api: AuthInstance['api'] = {
    getSession: async ({ headers }) => getSessionFromHeaders(headers, sessionOptions),

    getSessionFromCookies: async (cookiesFn) => {
      const cookieStore = await cookiesFn();
      return getSessionFromCookies(cookieStore, sessionOptions);
    },

    signIn,
    selectTenant,
    signOut,
    refresh,
  };

  const handler: AuthInstance['handler'] = async (request) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const route = segments.pop() as RouteKey | undefined;

    // Get session with mutable cookie store
    const { session: clientSession, raw: session, cookieStore } = await getSessionFromHeaders(
      request.headers,
      sessionOptions
    );

    // Find handler
    const routeHandler = route ? HANDLERS[route] : undefined;

    if (!routeHandler) return new Response('Not found', { status: 404 });

    // Execute handler
    const response = await routeHandler({ request, session, clientSession, api });

    // Add Set-Cookie header if session was modified
    const setCookieValue = cookieStore.getSetCookieValue();
    if (setCookieValue) {
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Set-Cookie', setCookieValue);
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    return response;
  };

  return {
    sessionOptions,
    authClient,
    api,
    handler,
  };
};

// Re-export types
export type { RefreshResult, SelectTenantResult, SignInCredentials, SignInResult } from './types';
