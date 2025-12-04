'use client';

import { useAuthContext } from './AuthProvider';

import type { Session } from '../types';

/**
 * UseSessionReturn - useSession return type
 */
export interface UseSessionReturn {
  /** Current session */
  session: Session | null;
  /** Whether loading */
  isLoading: boolean;
  /** Refresh session */
  refresh: () => Promise<void>;
}

/**
 * useSession - Get current session information
 *
 * @example
 * ```tsx
 * import { useSession } from '@assetforce/auth/react';
 *
 * function SessionInfo() {
 *   const { session, isLoading } = useSession();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!session) return <div>No session</div>;
 *
 *   return <div>Session expires at: {session.expiresAt.toISOString()}</div>;
 * }
 * ```
 */
export function useSession(): UseSessionReturn {
  const { session, isLoading, refresh } = useAuthContext();
  return { session, isLoading, refresh };
}
