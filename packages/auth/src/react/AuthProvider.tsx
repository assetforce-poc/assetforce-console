'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { IdentityContext, Session, User } from '../types';

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
  /** Identity context (AssetForce extension) */
  identity: IdentityContext | null;
}

/**
 * AuthActions - Authentication actions
 */
export interface AuthActions {
  /** Sign in */
  signIn: (credentials: { username: string; password: string }) => Promise<void>;
  /** Sign out */
  signOut: () => Promise<void>;
  /** Refresh session */
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
  children: ReactNode;
}

/**
 * AuthProvider - Authentication state provider
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
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    session: null,
    identity: null,
  });

  // Initialize: check existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        // TODO: Call Better Auth API to check session
        setState((prev) => ({ ...prev, isLoading: false }));
      } catch {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    checkSession();
  }, []);

  // Sign in
  const signIn = async (credentials: { username: string; password: string }) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // TODO: Call Better Auth API to sign in
      console.log('signIn', credentials);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // TODO: Call Better Auth API to sign out
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: null,
        identity: null,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Refresh session
  const refresh = async () => {
    // TODO: Call Better Auth API to refresh
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signIn,
      signOut,
      refresh,
    }),
    [state]
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
