import type { IronSession } from 'iron-session';

import type { Session, SessionData, Tenant } from '../types';

/**
 * SignInCredentials
 */
export interface SignInCredentials {
  username: string;
  password: string;
}

/**
 * SignInResult
 */
export interface SignInResult {
  success: boolean;
  tenant?: {
    available?: Tenant[];
  };
  subject?: string;
  error?: string;
}

/**
 * SelectTenantResult
 */
export interface SelectTenantResult {
  success: boolean;
  error?: string;
}

/**
 * RefreshResult
 */
export interface RefreshResult {
  success: boolean;
  error?: string;
}

/**
 * Handler Context - Passed to each route handler
 */
export interface HandlerContext {
  request: Request;
  session: IronSession<SessionData>;
  clientSession: Session | null;
  api: {
    signIn: (credentials: SignInCredentials, session: IronSession<SessionData>) => Promise<SignInResult>;
    selectTenant: (subject: string, tenantId: string, session: IronSession<SessionData>) => Promise<SelectTenantResult>;
    signOut: (session: IronSession<SessionData>) => Promise<void>;
    refresh: (session: IronSession<SessionData>) => Promise<RefreshResult>;
  };
}

/**
 * Route Handler function signature
 */
export type RouteHandler = (ctx: HandlerContext) => Promise<Response>;

/**
 * Route constants
 */
export const ROUTE = {
  SESSION: 'session',
  SIGNIN: 'signin',
  SELECT_TENANT: 'select-tenant',
  SIGNOUT: 'signout',
  REFRESH: 'refresh',
} as const;

export type RouteKey = (typeof ROUTE)[keyof typeof ROUTE];
