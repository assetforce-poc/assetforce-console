'use client';

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { SignInCredentials, SignInResult } from '../server/types';
import type { IdentityContext, Session, Tenant, User } from '../types';

// Re-export types for consumers
export type { SignInCredentials, SignInResult } from '../server/types';

/**
 * AuthState - Authentication state
 */
export interface AuthState {
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether loading */
  isLoading: boolean;
  /** Current user */
  user: User | null;
  /** Current session */
  session: Session | null;
  /** Identity context (4D Identity Model) */
  identity: IdentityContext | null;
  /** Current tenant */
  tenant: Tenant | null;
  /** Whether tenant selection is pending */
  pendingTenantSelection: boolean;
  /** Available tenants for selection */
  availableTenants: Tenant[];
}

/**
 * AuthActions - Authentication actions
 */
export interface AuthActions {
  /** Sign in with credentials */
  signIn: (credentials: SignInCredentials) => Promise<SignInResult>;
  /** Sign out */
  signOut: () => Promise<void>;
  /** Select tenant (for multi-tenant scenarios) */
  selectTenant: (tenantId: string) => Promise<void>;
  /** Refresh session from server */
  refresh: () => Promise<void>;
}

/**
 * AuthContextValue - Complete context value
 */
export type AuthContextValue = AuthState & AuthActions;

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * AuthProviderProps
 */
export interface AuthProviderProps {
  /** Child components */
  children: ReactNode;
  /** Base path for auth API (default: /api/auth) */
  basePath?: string;
}

/**
 * AuthProvider - Authentication state provider
 *
 * Manages authentication state and provides auth actions to child components.
 * Works with iron-session based server API.
 *
 * @example
 * ```tsx
 * import { AuthProvider } from '@assetforce/auth/react';
 *
 * export default function RootLayout({ children }) {
 *   return <AuthProvider>{children}</AuthProvider>;
 * }
 * ```
 */
export function AuthProvider({ children, basePath = '/api/auth' }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    session: null,
    identity: null,
    tenant: null,
    pendingTenantSelection: false,
    availableTenants: [],
  });

  /**
   * Fetch current session from server
   */
  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch(`${basePath}/session`, {
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.session as Session | null;
    } catch {
      return null;
    }
  }, [basePath]);

  /**
   * Update state from session
   */
  const updateStateFromSession = useCallback((session: Session | null) => {
    if (session && session.isValid) {
      setState({
        isAuthenticated: true,
        isLoading: false,
        user: session.user,
        session,
        identity: session.identity,
        tenant: session.tenant,
        pendingTenantSelection: false,
        availableTenants: [],
      });
    } else {
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: null,
        identity: null,
        tenant: null,
        pendingTenantSelection: false,
        availableTenants: [],
      });
    }
  }, []);

  // Initialize: check existing session
  useEffect(() => {
    const checkSession = async () => {
      const session = await fetchSession();
      updateStateFromSession(session);
    };
    checkSession();
  }, [fetchSession, updateStateFromSession]);

  /**
   * Sign in with credentials
   */
  const signIn = useCallback(
    async (credentials: SignInCredentials): Promise<SignInResult> => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await fetch(`${basePath}/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          setState((prev) => ({ ...prev, isLoading: false }));
          return { success: false, error: data.error || 'Sign in failed' };
        }

        // Check if tenant selection is required
        if (data.requiresTenantSelection) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            pendingTenantSelection: true,
            availableTenants: data.availableTenants || [],
          }));
          return {
            success: true,
            requiresTenantSelection: true,
            availableTenants: data.availableTenants,
          };
        }

        // Fully authenticated
        const session = await fetchSession();
        updateStateFromSession(session);
        return { success: true };
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Network error',
        };
      }
    },
    [basePath, fetchSession, updateStateFromSession]
  );

  /**
   * Sign out
   */
  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await fetch(`${basePath}/signout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore errors, clear local state anyway
    }

    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      session: null,
      identity: null,
      tenant: null,
      pendingTenantSelection: false,
      availableTenants: [],
    });
  }, [basePath]);

  /**
   * Select tenant
   */
  const selectTenant = useCallback(
    async (tenantId: string) => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await fetch(`${basePath}/select-tenant`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ tenantId }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to select tenant');
        }

        // Refresh session after tenant selection
        const session = await fetchSession();
        updateStateFromSession(session);
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    [basePath, fetchSession, updateStateFromSession]
  );

  /**
   * Refresh session
   */
  const refresh = useCallback(async () => {
    const session = await fetchSession();
    updateStateFromSession(session);
  }, [fetchSession, updateStateFromSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signIn,
      signOut,
      selectTenant,
      refresh,
    }),
    [state, signIn, signOut, selectTenant, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuthContext - Internal hook to get context
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
