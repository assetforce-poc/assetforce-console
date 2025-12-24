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

// ========== Password Management Types ==========

/**
 * ForgotPasswordResult
 */
export interface ForgotPasswordResult {
  success: boolean;
  message?: string;
}

/**
 * ResetPasswordResult
 */
export interface ResetPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * ChangePasswordResult
 */
export interface ChangePasswordResult {
  success: boolean;
  message?: string;
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
    // Password management
    forgotPassword: (email: string) => Promise<ForgotPasswordResult>;
    resetPassword: (token: string, newPassword: string) => Promise<ResetPasswordResult>;
    changePassword: (
      currentPassword: string,
      newPassword: string,
      session: IronSession<SessionData>
    ) => Promise<ChangePasswordResult>;
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
  // Password management routes
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
  CHANGE_PASSWORD: 'change-password',
} as const;

export type RouteKey = (typeof ROUTE)[keyof typeof ROUTE];
