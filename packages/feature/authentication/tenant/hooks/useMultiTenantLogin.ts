'use client';

import { useCallback, useState } from 'react';

import type { MultiTenantLoginState, Realm } from '../types';

/**
 * API Tenant type (from @assetforce/auth)
 */
interface ApiTenant {
  id: string;
  name: string;
  zoneId?: string;
  realmType?: string;
  description?: string;
}

/**
 * API Response types (matches @assetforce/auth server responses)
 */
interface SignInResponse {
  success: boolean;
  tenant?: {
    available?: ApiTenant[];
  };
  subject?: string;
  error?: string;
}

interface SelectTenantResponse {
  success: boolean;
  error?: string;
}

/**
 * Auth result returned on success
 */
export interface AuthResult {
  success: boolean;
  /** True if user has no tenants and needs to join/create one */
  requiresTenantOnboarding?: boolean;
  error?: string;
}

export interface UseMultiTenantLoginOptions {
  /** Base path for auth API (default: /api/auth) */
  basePath?: string;
  /** Callback when login completes successfully */
  onSuccess?: (result: AuthResult) => void;
  /** Callback when an error occurs */
  onError?: (error: string) => void;
}

export interface UseMultiTenantLoginReturn {
  /** Current state of the multi-tenant login flow */
  state: MultiTenantLoginState;
  /** Loading state */
  loading: boolean;
  /** Step 1: Authenticate with credentials */
  authenticate: (username: string, password: string) => Promise<void>;
  /** Step 2: Select a tenant (realm) - only needed for multiple realms */
  selectTenant: (realm: Realm) => Promise<void>;
  /** Reset the flow to start over */
  reset: () => void;
}

const initialState: MultiTenantLoginState = {
  step: 'credentials',
};

/**
 * Convert API Tenant to UI Realm type
 */
function toRealm(tenant: ApiTenant): Realm {
  return {
    realmId: tenant.id,
    realmName: tenant.name,
    displayName: tenant.name,
    zoneId: tenant.zoneId ?? '',
    realmType: (tenant.realmType as Realm['realmType']) ?? 'PRODUCTION',
    description: tenant.description,
    isActive: true,
  };
}

/**
 * useMultiTenantLogin - Multi-tenant authentication hook
 *
 * Uses @assetforce/auth API endpoints instead of direct GraphQL calls.
 * The authentication flow:
 * 1. Call /api/auth/signin with credentials
 * 2. If multiple tenants, show selection UI
 * 3. Call /api/auth/select-tenant with chosen tenant
 *
 * @example
 * ```tsx
 * const { state, loading, authenticate, selectTenant } = useMultiTenantLogin({
 *   onSuccess: () => router.push('/dashboard'),
 *   onError: (msg) => console.error(msg),
 * });
 * ```
 */
export const useMultiTenantLogin = (options?: UseMultiTenantLoginOptions): UseMultiTenantLoginReturn => {
  const basePath = options?.basePath ?? '/api/auth';
  const [state, setState] = useState<MultiTenantLoginState>(initialState);
  const [loading, setLoading] = useState(false);

  // Authenticate - handles both single and multiple realm cases
  const authenticate = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      setState((prev) => ({ ...prev, error: undefined }));

      try {
        const response = await fetch(`${basePath}/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username, password }),
        });

        const data: SignInResponse = await response.json();

        if (!data.success) {
          setState((prev) => ({
            ...prev,
            error: data.error ?? 'Authentication failed',
          }));
          options?.onError?.(data.error ?? 'Authentication failed');
          return;
        }

        // Determine tenant status from available array
        const availableTenants = data.tenant?.available ?? [];
        const tenantCount = availableTenants.length;

        if (tenantCount === 0) {
          // No tenant - mark as complete and let onSuccess handler redirect to tenant onboarding
          setState({
            step: 'complete',
            subject: data.subject,
          });
          options?.onSuccess?.({ success: true, requiresTenantOnboarding: true });
          return;
        }

        if (tenantCount > 1) {
          // Multiple tenants - show selection UI
          const availableRealms = availableTenants.map(toRealm);
          setState({
            step: 'tenant-selection',
            subject: data.subject,
            availableRealms,
          });
          return;
        }

        // Single tenant - authentication complete
        setState({
          step: 'complete',
          subject: data.subject,
        });
        options?.onSuccess?.({ success: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        setState((prev) => ({ ...prev, error: message }));
        options?.onError?.(message);
      } finally {
        setLoading(false);
      }
    },
    [basePath, options]
  );

  // Select tenant - only called for multiple realms case
  const selectTenant = useCallback(
    async (realm: Realm) => {
      if (!state.subject) {
        setState((prev) => ({ ...prev, error: 'No subject available' }));
        return;
      }

      setLoading(true);
      setState((prev) => ({ ...prev, selectedRealm: realm, error: undefined }));

      try {
        const response = await fetch(`${basePath}/select-tenant`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ tenantId: realm.realmId }),
        });

        const data: SelectTenantResponse = await response.json();

        if (!data.success) {
          setState((prev) => ({
            ...prev,
            error: data.error ?? 'Failed to select tenant',
          }));
          options?.onError?.(data.error ?? 'Failed to select tenant');
          return;
        }

        setState({
          step: 'complete',
          subject: state.subject,
          selectedRealm: realm,
        });
        options?.onSuccess?.({ success: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        setState((prev) => ({ ...prev, error: message }));
        options?.onError?.(message);
      } finally {
        setLoading(false);
      }
    },
    [basePath, state.subject, options]
  );

  // Reset the flow
  const reset = useCallback(() => {
    setState(initialState);
    setLoading(false);
  }, []);

  return {
    state,
    loading,
    authenticate,
    selectTenant,
    reset,
  };
};
