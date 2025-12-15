'use client';

import { useCallback, useState } from 'react';

import { useAuthAdapter } from '../adapter/AuthProvider';
import type { ForgotPasswordData, ForgotPasswordResult } from '../adapter/types';

export interface UseForgotPasswordOptions {
  /**
   * Custom forgot password function (overrides adapter)
   */
  onForgotPassword?: (data: ForgotPasswordData) => Promise<ForgotPasswordResult>;

  /**
   * Success callback
   */
  onSuccess?: (result: ForgotPasswordResult) => void;

  /**
   * Error callback
   */
  onError?: (error: string) => void;
}

export interface UseForgotPasswordReturn {
  /**
   * Forgot password function
   */
  forgotPassword: (data: ForgotPasswordData) => Promise<ForgotPasswordResult | undefined>;

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
 * useForgotPassword - Forgot password hook with adapter or callback support
 *
 * Usage with adapter:
 * ```tsx
 * const { forgotPassword, isLoading, error } = useForgotPassword({
 *   onSuccess: (result) => router.push(`/auth/forgot/password/sent?email=${result.email}`)
 * });
 * ```
 *
 * Usage with callback:
 * ```tsx
 * const { forgotPassword, isLoading, error } = useForgotPassword({
 *   onForgotPassword: async (data) => {
 *     const response = await fetch('/api/forgot-password', { ... });
 *     return response.json();
 *   }
 * });
 * ```
 */
export function useForgotPassword(options: UseForgotPasswordOptions = {}): UseForgotPasswordReturn {
  const { onForgotPassword, onSuccess, onError } = options;
  const adapter = useAuthAdapter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const forgotPassword = useCallback(
    async (data: ForgotPasswordData): Promise<ForgotPasswordResult | undefined> => {
      // Validate: must have either adapter or onForgotPassword callback
      if (!adapter && !onForgotPassword) {
        const errorMsg =
          'No forgot password method provided. Either wrap your app with AuthProvider or pass onForgotPassword callback to useForgotPassword.';
        setError(errorMsg);
        onError?.(errorMsg);
        return undefined;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Use custom callback if provided, otherwise use adapter
        const forgotPasswordFn = onForgotPassword || adapter!.forgotPassword.bind(adapter);
        const result = await forgotPasswordFn(data);

        if (result.success) {
          onSuccess?.(result);
        } else {
          const errorMsg = result.error || 'Failed to send password reset email';
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
    [adapter, onForgotPassword, onSuccess, onError]
  );

  return {
    forgotPassword,
    isLoading,
    error,
    clearError,
  };
}
