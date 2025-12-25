'use client';

import { useMutation } from '@assetforce/graphql';
import { useCallback } from 'react';

import type { ActivateAccountInput, ActivationResult } from '../../generated/graphql';
import { ActivateAccountDocument as ACTIVATE_ACCOUNT_MUTATION } from '../../generated/graphql';

// Re-export GraphQL types for external consumption
export type { ActivateAccountInput, ActivationResult };

export interface UseActivateAccountReturn {
  /** Execute account activation */
  activate: (input: ActivateAccountInput) => Promise<void>;
  /** Loading state */
  loading: boolean;
  /** Error if any */
  error: Error | undefined;
  /** Activation result */
  result?: ActivationResult;
}

/**
 * useActivateAccount Hook - Activate account with password
 *
 * Activates account using token from email and sets password.
 * On success, returns JWT tokens for auto-login.
 *
 * @example
 * ```tsx
 * const { activate, loading, result, error } = useActivateAccount();
 *
 * const handleSubmit = async (password: string) => {
 *   await activate({ token, password });
 * };
 *
 * useEffect(() => {
 *   if (result?.success) {
 *     // Redirect to login or auto-login
 *     router.push('/auth/login?activated=success');
 *   }
 * }, [result]);
 * ```
 */
export function useActivateAccount(): UseActivateAccountReturn {
  const [mutate, { data, loading, error }] = useMutation(ACTIVATE_ACCOUNT_MUTATION);

  const activate = useCallback(
    async (input: ActivateAccountInput): Promise<void> => {
      await mutate({
        variables: { input },
      });
    },
    [mutate]
  );

  const result = data?.account?.activation?.activate;

  return {
    activate,
    loading,
    error,
    result,
  };
}
