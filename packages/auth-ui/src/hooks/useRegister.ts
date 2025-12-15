'use client';

import { useCallback, useState } from 'react';

import { useAuthAdapter } from '../adapter/AuthProvider';
import type { RegisterData, RegisterResult } from '../adapter/types';

export interface UseRegisterOptions {
  /**
   * Custom register function (overrides adapter)
   */
  onRegister?: (data: RegisterData) => Promise<RegisterResult>;

  /**
   * Success callback
   */
  onSuccess?: (result: RegisterResult) => void;

  /**
   * Error callback
   */
  onError?: (error: string) => void;
}

export interface UseRegisterReturn {
  /**
   * Register function
   */
  register: (data: RegisterData) => Promise<RegisterResult | undefined>;

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
 * useRegister - Registration hook with adapter or callback support
 *
 * Usage with adapter:
 * ```tsx
 * const { register, isLoading, error } = useRegister({
 *   onSuccess: (result) => router.push(`/auth/register/success?email=${result.email}`)
 * });
 * ```
 *
 * Usage with callback:
 * ```tsx
 * const { register, isLoading, error } = useRegister({
 *   onRegister: async (data) => {
 *     const response = await fetch('/api/register', { ... });
 *     return response.json();
 *   }
 * });
 * ```
 */
export function useRegister(options: UseRegisterOptions = {}): UseRegisterReturn {
  const { onRegister, onSuccess, onError } = options;
  const adapter = useAuthAdapter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const register = useCallback(
    async (data: RegisterData): Promise<RegisterResult | undefined> => {
      // Validate: must have either adapter or onRegister callback
      if (!adapter && !onRegister) {
        const errorMsg =
          'No register method provided. Either wrap your app with AuthProvider or pass onRegister callback to useRegister.';
        setError(errorMsg);
        onError?.(errorMsg);
        return undefined;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Use custom callback if provided, otherwise use adapter
        const registerFn = onRegister || adapter!.register.bind(adapter);
        const result = await registerFn(data);

        if (result.success) {
          onSuccess?.(result);
        } else {
          const errorMsg = result.error || 'Registration failed';
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
    [adapter, onRegister, onSuccess, onError]
  );

  return {
    register,
    isLoading,
    error,
    clearError,
  };
}
