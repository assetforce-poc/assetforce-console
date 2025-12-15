import type { IronSession, SessionOptions } from 'iron-session';
import { getIronSession } from 'iron-session';

import type { Session, SessionData } from '../../types';

/**
 * Assign session data to iron-session explicitly
 *
 * Avoids Object.assign to prevent overwriting iron-session internal properties.
 */
export function assignSessionData(session: IronSession<SessionData>, data: SessionData): void {
  session.accessToken = data.accessToken;
  session.refreshToken = data.refreshToken;
  session.expiresAt = data.expiresAt;
  session.user = data.user;
  session.identity = data.identity;
  session.tenant = data.tenant;
}

/**
 * Convert SessionData to client-safe Session
 *
 * Strips sensitive data (tokens) before sending to client.
 */
export function toClientSession(data: SessionData): Session | null {
  // Special case: authenticated but no tenant (needs onboarding)
  if (data.requiresTenantOnboarding && data._pendingSubject) {
    return {
      isValid: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours for onboarding
      user: null,
      identity: null,
      tenant: null,
      requiresTenantOnboarding: true,
    };
  }

  if (!data.accessToken || !data.expiresAt) {
    return null;
  }

  // Check if session is expired
  if (data.expiresAt < Date.now()) {
    return null;
  }

  return {
    isValid: true,
    expiresAt: new Date(data.expiresAt),
    user: data.user || null,
    identity: data.identity || null,
    tenant: data.tenant || null,
  };
}

/**
 * Cookie store interface for reading cookies from headers
 */
interface CookieStore {
  get: (name: string) => { name: string; value: string } | undefined;
  set: (name: string, value: string, options?: Record<string, unknown>) => void;
}

/**
 * Mutable cookie store that captures set operations
 */
export interface MutableCookieStore extends CookieStore {
  /** Get the cookie value to set in response (if any) */
  getSetCookieValue: () => string | null;
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Create a mutable cookie store from request headers
 * Captures set() calls for later use in Response headers
 */
export function createCookieStoreFromHeaders(headers: Headers): MutableCookieStore {
  const cookieHeader = headers.get('cookie') || '';
  let setCookieValue: string | null = null;

  return {
    get: (name: string) => {
      const escapedName = escapeRegex(name);
      const match = cookieHeader.match(new RegExp(`${escapedName}=([^;]+)`));
      if (!match || match[1] === undefined) return undefined;
      return { name, value: match[1] };
    },
    set: (name: string, value: string, options?: Record<string, unknown>) => {
      // Build cookie string
      let cookie = `${name}=${value}`;
      if (options) {
        if (options.httpOnly) cookie += '; HttpOnly';
        if (options.secure) cookie += '; Secure';
        if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
        if (options.path) cookie += `; Path=${options.path}`;
        if (options.maxAge !== undefined) cookie += `; Max-Age=${options.maxAge}`;
      }
      setCookieValue = cookie;
    },
    getSetCookieValue: () => setCookieValue,
  };
}

/**
 * Get session from headers (for Route Handlers)
 * Returns cookie store to allow getting Set-Cookie value after session.save()
 */
export async function getSessionFromHeaders(
  headers: Headers,
  sessionOptions: SessionOptions
): Promise<{ session: Session | null; raw: IronSession<SessionData>; cookieStore: MutableCookieStore }> {
  const cookieStore = createCookieStoreFromHeaders(headers);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ironSession = await getIronSession<SessionData>(cookieStore as any, sessionOptions);

  const session = toClientSession(ironSession);
  return { session, raw: ironSession, cookieStore };
}

/**
 * Get session from Next.js cookies() function
 */
export async function getSessionFromCookies<
  T extends {
    get: (name: string) => { name: string; value: string } | undefined;
    set: (name: string, value: string, options?: unknown) => void;
  },
>(cookieStore: T, sessionOptions: SessionOptions): Promise<{ session: Session | null; raw: IronSession<SessionData> }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ironSession = await getIronSession<SessionData>(cookieStore as any, sessionOptions);

  const session = toClientSession(ironSession);
  return { session, raw: ironSession };
}
