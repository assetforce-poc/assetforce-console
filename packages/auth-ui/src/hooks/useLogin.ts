'use client';

import { useCallback, useState } from 'react';

import { useAuthAdapter } from '../adapter/AuthProvider';
import type { LoginCredentials, LoginResult } from '../adapter/types';

export interface UseLoginOptions {
  /**
   * Custom login function (overrides adapter)
   */
  onLogin?: (credentials: LoginCredentials) => Promise<LoginResult>;

  /**
   * Success callback
   */
  onSuccess?: (result: LoginResult) => void;

  /**
   * Error callback
   */
  onError?: (error: string) => void;
}

export interface UseLoginReturn {
  /**
   * Login function
   */
  login: (credentials: LoginCredentials) => Promise<LoginResult | undefined>;

  /**
   * Loading state
   */
  isLoading: boolean;

  /**
   * Error message
   */
  error: string | null;

  /**
   * Clear error
   */
  clearError: () => void;
}

/**
 * useLogin - Login hook with adapter or callback support
 *
 * Usage with adapter (global configuration):
 * ```tsx
 * const { login, isLoading, error } = useLogin({
 *   onSuccess: (result) => router.push('/dashboard')
 * });
 * ```
 *
 * Usage with callback (custom logic):
 * ```tsx
 * const { login, isLoading, error } = useLogin({
 *   onLogin: async (credentials) => {
 *     const response = await fetch('/api/login', { ... });
 *     return response.json();
 *   },
 *   onSuccess: (result) => router.push('/dashboard')
 * });
 * ```
 */
export function useLogin(options: UseLoginOptions = {}): UseLoginReturn {
  const { onLogin, onSuccess, onError } = options;
  const adapter = useAuthAdapter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<LoginResult | undefined> => {
      // Validate: must have either adapter or onLogin callback
      if (!adapter && !onLogin) {
        const errorMsg =
          'No login method provided. Either wrap your app with AuthProvider or pass onLogin callback to useLogin.';
        setError(errorMsg);
        onError?.(errorMsg);
        return undefined;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Use custom callback if provided, otherwise use adapter
        const loginFn = onLogin || adapter!.login.bind(adapter);
        const result = await loginFn(credentials);

        if (result.success) {
          onSuccess?.(result);
        } else {
          const errorMsg = result.error || 'Login failed';
          setError(errorMsg);
          onError?.(errorMsg);
        }

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMsg);
        onError?.(errorMsg);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [adapter, onLogin, onSuccess, onError]
  );

  return {
    login,
    isLoading,
    error,
    clearError,
  };
}
