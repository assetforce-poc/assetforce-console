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
interface ReadonlyCookieStore {
  get: (name: string) => { name: string; value: string } | undefined;
  set: () => void;
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Create a read-only cookie store from request headers
 */
export function createCookieStoreFromHeaders(headers: Headers): ReadonlyCookieStore {
  const cookieHeader = headers.get('cookie') || '';

  return {
    get: (name: string) => {
      const escapedName = escapeRegex(name);
      const match = cookieHeader.match(new RegExp(`${escapedName}=([^;]+)`));
      if (!match || match[1] === undefined) return undefined;
      return { name, value: match[1] };
    },
    set: () => {
      // Read-only in this context
    },
  };
}

/**
 * Get session from headers (for Route Handlers)
 */
export async function getSessionFromHeaders(
  headers: Headers,
  sessionOptions: SessionOptions
): Promise<{ session: Session | null; raw: IronSession<SessionData> }> {
  const cookieStore = createCookieStoreFromHeaders(headers);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ironSession = await getIronSession<SessionData>(cookieStore as any, sessionOptions);

  const session = toClientSession(ironSession);
  return { session, raw: ironSession };
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
