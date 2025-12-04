'use client';

import { type AuthContextValue, useAuthContext } from './AuthProvider';

/**
 * UseAuthReturn - useAuth return type
 */
export type UseAuthReturn = AuthContextValue;

/**
 * useAuth - Get authentication state and actions
 *
 * @example
 * ```tsx
 * import { useAuth } from '@assetforce/auth/react';
 *
 * function MyComponent() {
 *   const { isAuthenticated, user, signIn, signOut } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <button onClick={() => signIn({ username, password })}>Sign In</button>;
 *   }
 *
 *   return (
 *     <div>
 *       Welcome, {user?.name}
 *       <button onClick={() => signOut()}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  return useAuthContext();
}
