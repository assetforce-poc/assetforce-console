'use client';

import { createContext, type ReactNode, useContext } from 'react';

import type { AuthAdapter } from './types';

/**
 * AuthProvider Context
 */
interface AuthProviderContextValue {
  adapter: AuthAdapter | null;
}

const AuthProviderContext = createContext<AuthProviderContextValue | undefined>(undefined);

export interface AuthProviderProps {
  /** Auth adapter implementation */
  adapter: AuthAdapter;
  /** Child components */
  children: ReactNode;
}

/**
 * AuthProvider - Provides auth adapter to all child components
 *
 * Usage:
 * ```tsx
 * const myAdapter: AuthAdapter = {
 *   login: async (credentials) => { ... },
 *   register: async (data) => { ... },
 *   // ... implement all methods
 * };
 *
 * <AuthProvider adapter={myAdapter}>
 *   <App />
 * </AuthProvider>
 * ```
 *
 * Components can then use hooks without passing adapter:
 * ```tsx
 * const { login, isLoading, error } = useLogin(); // Uses adapter from context
 * ```
 */
export function AuthProvider({ adapter, children }: AuthProviderProps) {
  return <AuthProviderContext.Provider value={{ adapter }}>{children}</AuthProviderContext.Provider>;
}

/**
 * useAuthAdapter - Get auth adapter from context
 *
 * @returns Auth adapter or null if not provided
 *
 * @example
 * ```tsx
 * const adapter = useAuthAdapter();
 * if (adapter) {
 *   const result = await adapter.login(credentials);
 * }
 * ```
 */
export function useAuthAdapter(): AuthAdapter | null {
  const context = useContext(AuthProviderContext);
  if (context === undefined) {
    // Not inside AuthProvider - return null (forms will require callback props)
    return null;
  }
  return context.adapter;
}
