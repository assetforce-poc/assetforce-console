'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback,useEffect } from 'react';

import { INVITE_PAGE_PATH, LOGIN_PAGE_PATH,PENDING_INVITE_TOKEN_KEY } from '../constants';

interface UseInviteTokenRecoveryOptions {
  /** Whether to skip automatic recovery (useful when token is already in URL) */
  skip?: boolean;
}

interface UseInviteTokenRecoveryResult {
  /** Save token to sessionStorage before redirecting to login */
  saveTokenForRecovery: (token: string) => void;
  /** Clear saved token from sessionStorage */
  clearSavedToken: () => void;
  /** Get saved token from sessionStorage (if any) */
  getSavedToken: () => string | null;
  /** Redirect to login page with return URL */
  redirectToLogin: (token: string) => void;
  /** Redirect to registration page with return URL */
  redirectToRegister: (token: string) => void;
}

/**
 * Hook for managing invite token recovery across login/register flow.
 *
 * When a user visits the invite page without being logged in:
 * 1. Save the token to sessionStorage
 * 2. Redirect to login with returnUrl pointing to invite page
 * 3. After login, the invite page loads again
 * 4. Check sessionStorage for saved token
 * 5. If found, restore it to URL and clear storage
 *
 * This approach avoids exposing the token in the login URL.
 *
 * @example
 * ```tsx
 * const { redirectToLogin, saveTokenForRecovery } = useInviteTokenRecovery();
 *
 * // When user needs to login
 * const handleLogin = () => {
 *   saveTokenForRecovery(token);
 *   redirectToLogin(token);
 * };
 * ```
 */
export function useInviteTokenRecovery(options: UseInviteTokenRecoveryOptions = {}): UseInviteTokenRecoveryResult {
  const { skip = false } = options;
  const router = useRouter();
  const searchParams = useSearchParams();

  const getSavedToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(PENDING_INVITE_TOKEN_KEY);
  }, []);

  const saveTokenForRecovery = useCallback((token: string) => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(PENDING_INVITE_TOKEN_KEY, token);
  }, []);

  const clearSavedToken = useCallback(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(PENDING_INVITE_TOKEN_KEY);
  }, []);

  const redirectToLogin = useCallback(
    (token: string) => {
      saveTokenForRecovery(token);
      const returnUrl = encodeURIComponent(INVITE_PAGE_PATH);
      router.push(`${LOGIN_PAGE_PATH}?returnUrl=${returnUrl}`);
    },
    [router, saveTokenForRecovery]
  );

  const redirectToRegister = useCallback(
    (token: string) => {
      saveTokenForRecovery(token);
      const returnUrl = encodeURIComponent(INVITE_PAGE_PATH);
      // Assuming registration page follows similar pattern
      router.push(`/auth/register?returnUrl=${returnUrl}`);
    },
    [router, saveTokenForRecovery]
  );

  // Auto-recover token from sessionStorage on page load
  useEffect(() => {
    if (skip) return;

    const currentToken = searchParams.get('token');
    const savedToken = getSavedToken();

    // If we have a saved token but no token in URL, restore it
    if (savedToken && !currentToken) {
      clearSavedToken();
      router.replace(`${INVITE_PAGE_PATH}?token=${savedToken}`);
    }
  }, [skip, searchParams, getSavedToken, clearSavedToken, router]);

  return {
    saveTokenForRecovery,
    clearSavedToken,
    getSavedToken,
    redirectToLogin,
    redirectToRegister,
  };
}

export default useInviteTokenRecovery;
