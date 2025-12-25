'use client';

import { useMutation } from '@assetforce/graphql';
import { useCallback } from 'react';

import type { CreateUserInput, CreateUserResult } from '../../generated/graphql';
import { CreateUserDocument as CREATE_USER_MUTATION } from '../../generated/graphql';

// Export for testing
export { CREATE_USER_MUTATION };

export interface UseCreateUserReturn {
  /** Execute user creation */
  createUser: (input: CreateUserInput) => Promise<CreateUserResult>;
  /** Loading state */
  loading: boolean;
  /** Error if any */
  error: Error | undefined;
}

/**
 * useCreateUser Hook - Create new user account with activation email or temporary password
 *
 * Provides mutation to create user accounts with two provisioning methods:
 * - EMAIL: Sends activation email, user sets own password
 * - TEMPORARY: Admin sets temporary password, user must change on first login
 *
 * @example
 * ```tsx
 * const { createUser, loading, error } = useCreateUser();
 *
 * const handleSubmit = async (formData) => {
 *   try {
 *     const result = await createUser({
 *       email: formData.email,
 *       displayName: formData.displayName,
 *       tenantId: formData.tenantId,
 *       role: formData.role,
 *       provision: 'EMAIL', // or 'TEMPORARY'
 *       password: formData.provision === 'TEMPORARY' ? formData.password : undefined,
 *     });
 *
 *     if (result.error) {
 *       showError(result.error.message);
 *     } else {
 *       showSuccess(`User created with status: ${result.status}`);
 *       router.push(`/accounts/${result.accountId}`);
 *     }
 *   } catch (err) {
 *     showError('Failed to create user');
 *   }
 * };
 * ```
 */
export function useCreateUser(): UseCreateUserReturn {
  const [mutate, { loading, error }] = useMutation(CREATE_USER_MUTATION);

  const createUser = useCallback(
    async (input: CreateUserInput): Promise<CreateUserResult> => {
      const result = await mutate({
        variables: { input },
      });

      if (!result.data?.account?.create) {
        throw new Error('User creation failed: No response from server');
      }

      return result.data.account.create;
    },
    [mutate]
  );

  return {
    createUser,
    loading,
    error,
  };
}
