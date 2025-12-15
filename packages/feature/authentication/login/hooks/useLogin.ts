'use client';

import { useCallback, useState } from 'react';

/**
 * API Response types (matches @assetforce/auth server responses)
 */
interface Tenant {
  id: string;
  name: string;
}

interface SignInResponse {
  success: boolean;
  tenant?: {
    available?: Tenant[];
  };
  error?: string;
}

// Types
export interface UseLoginInput {
  credential: string; // email or username
  password: string;
}

export interface MFAChallenge {
  type: 'totp' | 'sms' | 'email';
  message: string;
}

export type LoginResult =
  | { type: 'success' }
  | { type: 'tenant_selection_required' }
  | { type: 'tenant_onboarding_required' }
  | { type: 'mfa_required'; challenge: MFAChallenge }
  | { type: 'error'; message: string };

export interface UseLoginOptions {
  /** Base path for auth API (default: /api/auth) */
  basePath?: string;
}

export interface UseLoginReturn {
  /** Perform login */
  login: (input: UseLoginInput) => Promise<LoginResult>;
  /** Loading state */
  loading: boolean;
}

/**
 * useLogin Hook - Simple email/username + password login
 *
 * Uses @assetforce/auth API endpoints instead of direct GraphQL calls.
 * For multi-tenant scenarios with tenant selection UI, use useMultiTenantLogin instead.
 *
 * @example
 * ```tsx
 * const { login, loading } = useLogin();
 *
 * const handleLogin = async () => {
 *   const result = await login({
 *     credential: 'user@example.com',
 *     password: 'password123',
 *   });
 *
 *   if (result.type === 'success') {
 *     router.push('/dashboard');
 *   } else if (result.type === 'tenant_selection_required') {
 *     router.push('/auth/select-tenant');
 *   } else if (result.type === 'tenant_onboarding_required') {
 *     router.push('/tenant/request');
 *   } else if (result.type === 'error') {
 *     setError(result.message);
 *   }
 * };
 * ```
 */
export function useLogin(options?: UseLoginOptions): UseLoginReturn {
  const basePath = options?.basePath ?? '/api/auth';
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (input: UseLoginInput): Promise<LoginResult> => {
      setLoading(true);

      try {
        const response = await fetch(`${basePath}/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            username: input.credential,
            password: input.password,
          }),
        });

        const data: SignInResponse = await response.json();

        if (!data.success) {
          // Check if MFA is required (by error message pattern)
          if (data.error?.includes('MFA') || data.error?.includes('2FA')) {
            return {
              type: 'mfa_required',
              challenge: {
                type: 'totp',
                message: data.error,
              },
            };
          }

          return {
            type: 'error',
            message: data.error || 'Login failed',
          };
        }

        // Determine tenant status from available array
        const tenantCount = data.tenant?.available?.length ?? 0;

        if (tenantCount === 0) {
          // No tenant: requires onboarding
          return { type: 'tenant_onboarding_required' };
        }

        if (tenantCount > 1) {
          // Multiple tenants: requires selection
          return { type: 'tenant_selection_required' };
        }

        // Single tenant: success
        return { type: 'success' };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Network error';
        return {
          type: 'error',
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    [basePath]
  );

  return {
    login,
    loading,
  };
}
