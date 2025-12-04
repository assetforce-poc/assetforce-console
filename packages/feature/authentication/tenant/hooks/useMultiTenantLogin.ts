import { useMutation } from '@apollo/client';
import { useCallback,useState } from 'react';

import type { AuthResult } from '../graphql/generated/graphql';
import { AuthenticateDocument, SelectTenantDocument } from '../graphql/generated/graphql';
import type { MultiTenantLoginState,Realm } from '../types';

export interface UseMultiTenantLoginOptions {
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

export const useMultiTenantLogin = (options?: UseMultiTenantLoginOptions): UseMultiTenantLoginReturn => {
  const [state, setState] = useState<MultiTenantLoginState>(initialState);
  const [loading, setLoading] = useState(false);

  const [authenticateMutation] = useMutation(AuthenticateDocument);
  const [selectTenantMutation] = useMutation(SelectTenantDocument);

  // Authenticate - handles both single and multiple realm cases
  const authenticate = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      setState((prev) => ({ ...prev, error: undefined }));

      try {
        const { data } = await authenticateMutation({
          variables: { username, password },
        });

        if (!data?.authenticate.success) {
          setState((prev) => ({
            ...prev,
            error: data?.authenticate.error ?? 'Authentication failed',
          }));
          return;
        }

        const subject = data.authenticate.subject;

        // Check if token is returned (single realm case)
        if (data.authenticate.accessToken) {
          // Single realm - authentication complete
          setState({
            step: 'complete',
            subject: subject ?? undefined,
          });

          // Call success callback with the result
          options?.onSuccess?.({
            success: true,
            accessToken: data.authenticate.accessToken,
            refreshToken: data.authenticate.refreshToken,
            expiresIn: data.authenticate.expiresIn,
            tokenType: data.authenticate.tokenType,
            identityContext: data.authenticate.identityContext,
          });
          return;
        }

        // Multiple realms - show selection UI
        const availableRealms = (data.authenticate.availableRealms ?? []) as Realm[];

        if (availableRealms.length === 0) {
          setState((prev) => ({
            ...prev,
            error: 'No tenants available for this user',
          }));
          return;
        }

        setState({
          step: 'tenant-selection',
          subject: subject ?? undefined,
          availableRealms,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        setState((prev) => ({ ...prev, error: message }));
        options?.onError?.(message);
      } finally {
        setLoading(false);
      }
    },
    [authenticateMutation, options]
  );

  // Select tenant - only called for multiple realms case
  const selectTenant = useCallback(
    async (realm: Realm) => {
      if (!state.subject) {
        setState((prev) => ({ ...prev, error: 'No subject available' }));
        return;
      }

      setLoading(true);
      setState((prev) => ({ ...prev, selectedRealm: realm }));

      try {
        const { data } = await selectTenantMutation({
          variables: { subject: state.subject, realmId: realm.realmId },
        });

        if (!data?.selectTenant.success) {
          setState((prev) => ({
            ...prev,
            error: data?.selectTenant.error ?? 'Failed to select tenant',
          }));
          return;
        }

        setState({
          step: 'complete',
          subject: state.subject,
          selectedRealm: realm,
        });

        options?.onSuccess?.(data.selectTenant);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        setState((prev) => ({ ...prev, error: message }));
        options?.onError?.(message);
      } finally {
        setLoading(false);
      }
    },
    [state.subject, selectTenantMutation, options]
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
