'use client';

import type { Session } from '../types';
import { useAuthContext } from './AuthProvider';

/**
 * UseSessionReturn - useSession return type
 */
export interface UseSessionReturn {
  /** Current session (client-safe, no tokens) */
  session: Session | null;
  /** Whether loading */
  isLoading: boolean;
  /** Refresh session from server */
  refresh: () => Promise<void>;
}

/**
 * useSession - Get current session information
 *
 * Returns the client-safe session data (no tokens exposed).
 * Use this hook when you only need session info, not auth actions.
 *
 * @example
 * ```tsx
 * import { useSession } from '@assetforce/auth/react';
 *
 * function SessionInfo() {
 *   const { session, isLoading } = useSession();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!session) return <div>Not authenticated</div>;
 *
 *   return (
 *     <div>
 *       <p>User: {session.user?.name}</p>
 *       <p>Tenant: {session.tenant?.name}</p>
 *       <p>Expires: {session.expiresAt.toISOString()}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSession(): UseSessionReturn {
  const { session, isLoading, refresh } = useAuthContext();
  return { session, isLoading, refresh };
}
