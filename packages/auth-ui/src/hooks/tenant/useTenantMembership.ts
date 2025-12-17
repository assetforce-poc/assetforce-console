'use client';

import { gql, useLazyQuery, useMutation, useQuery } from '@assetforce/graphql';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { ApplyResult, CooldownStatus, MutationResult, Tenant, TenantApplication, TenantConnection } from './types';

// GraphQL Queries
const TENANT_MINE = gql`
  query TenantMine {
    tenant {
      mine {
        id
        name
        displayName
      }
    }
  }
`;

const TENANT_APPLICATIONS = gql`
  query TenantApplications {
    tenant {
      applications {
        id
        status
        message
        createdAt
        updatedAt
        tenant {
          id
          name
          displayName
        }
      }
    }
  }
`;

const TENANT_AVAILABLE = gql`
  query TenantAvailable($input: TenantAvailableInput!) {
    tenant {
      available(input: $input) {
        items {
          id
          name
          displayName
        }
        total
        hasMore
      }
    }
  }
`;

const TENANT_COOLDOWN = gql`
  query TenantCooldown($input: TenantCooldownInput) {
    tenant {
      cooldown(input: $input) {
        canApply
        until
        reason
      }
    }
  }
`;

// GraphQL Mutations
const TENANT_APPLY = gql`
  mutation TenantApply($input: TenantApplyInput!) {
    tenant {
      users {
        apply(input: $input) {
          success
          message
          application {
            id
            status
            tenant {
              id
              name
              displayName
            }
          }
        }
      }
    }
  }
`;

const TENANT_CANCEL = gql`
  mutation TenantCancel($input: TenantCancelInput!) {
    tenant {
      users {
        cancel(input: $input) {
          success
          message
        }
      }
    }
  }
`;

const TENANT_LEAVE = gql`
  mutation TenantLeave($input: TenantLeaveInput!) {
    tenant {
      users {
        leave(input: $input) {
          success
          message
        }
      }
    }
  }
`;

export interface UseTenantMembershipOptions {
  /** Debounce delay for search (default: 300ms) */
  debounceMs?: number;
  /** Number of items per page (default: 20) */
  pageSize?: number;
  /** Callback when apply succeeds */
  onApplySuccess?: (result: ApplyResult) => void;
  /** Callback when cancel succeeds */
  onCancelSuccess?: () => void;
  /** Callback when leave succeeds */
  onLeaveSuccess?: () => void;
  /** Callback on any error */
  onError?: (error: string) => void;
}

export interface UseTenantMembershipReturn {
  // Data
  myTenants: Tenant[];
  pendingApplications: TenantApplication[];
  availableTenants: Tenant[];
  globalCooldown: CooldownStatus | null;
  cooldownByTenantId: Record<string, CooldownStatus>;

  // Loading states
  isLoadingMine: boolean;
  isLoadingApplications: boolean;
  isLoadingAvailable: boolean;
  isApplying: boolean;
  isCancelling: boolean;
  isLeaving: boolean;

  // Error states
  error: string | null;
  clearError: () => void;

  // Search
  search: string;
  setSearch: (value: string) => void;
  hasMore: boolean;
  loadMore: () => void;

  // Actions
  apply: (tenantId: string, message?: string) => Promise<ApplyResult | undefined>;
  cancel: (applicationId: string) => Promise<MutationResult | undefined>;
  leave: (tenantId: string) => Promise<MutationResult | undefined>;
  refetchAll: () => Promise<void>;
}

/**
 * useTenantMembership - Complete tenant membership management hook
 *
 * Provides:
 * - List of joined tenants (mine)
 * - List of pending applications
 * - Search available tenants with debounce
 * - Apply/Cancel/Leave mutations
 * - Cooldown status (global and per-tenant)
 */
export function useTenantMembership(options: UseTenantMembershipOptions = {}): UseTenantMembershipReturn {
  const { debounceMs = 300, pageSize = 20, onApplySuccess, onCancelSuccess, onLeaveSuccess, onError } = options;

  // Local state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cooldownByTenantId, setCooldownByTenantId] = useState<Record<string, CooldownStatus>>({});

  // Debounce search
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search.trim()), debounceMs);
    return () => clearTimeout(handle);
  }, [search, debounceMs]);

  // Queries
  const mineQuery = useQuery<{ tenant: { mine: Tenant[] } }>(TENANT_MINE);

  const appsQuery = useQuery<{ tenant: { applications: TenantApplication[] } }>(TENANT_APPLICATIONS);

  const cooldownQuery = useQuery<{ tenant: { cooldown: CooldownStatus } }>(TENANT_COOLDOWN, {
    variables: { input: null },
  });

  const availableQueryVariables = useMemo(
    () => ({
      input: {
        search: debouncedSearch || null,
        limit: pageSize,
        offset: 0,
      },
    }),
    [debouncedSearch, pageSize]
  );

  const availableQuery = useQuery<
    { tenant: { available: TenantConnection } },
    { input: { search?: string | null; limit: number; offset: number } }
  >(TENANT_AVAILABLE, {
    variables: availableQueryVariables,
    skip: debouncedSearch.length === 0,
  });

  // Lazy query for per-tenant cooldown
  const [fetchTenantCooldown] = useLazyQuery<{ tenant: { cooldown: CooldownStatus } }, { input: { tenantId: string } }>(
    TENANT_COOLDOWN
  );

  // Fetch cooldown for available tenants
  const availableItems = availableQuery.data?.tenant.available.items ?? [];

  useEffect(() => {
    if (availableItems.length === 0) return;

    const missing = availableItems.filter((t) => cooldownByTenantId[t.id] === undefined);
    if (missing.length === 0) return;

    missing.forEach((t) => {
      fetchTenantCooldown({ variables: { input: { tenantId: t.id } } })
        .then((result) => {
          const status = result.data?.tenant.cooldown ?? { canApply: true };
          setCooldownByTenantId((prev) => ({ ...prev, [t.id]: status }));
        })
        .catch(() => {
          setCooldownByTenantId((prev) => ({ ...prev, [t.id]: { canApply: true } }));
        });
    });
  }, [availableItems, cooldownByTenantId, fetchTenantCooldown]);

  // Mutations
  const [applyMutation, applyState] = useMutation<
    { tenant: { users: { apply: ApplyResult } } },
    { input: { tenantId: string; message?: string | null } }
  >(TENANT_APPLY);

  const [cancelMutation, cancelState] = useMutation<
    { tenant: { users: { cancel: MutationResult } } },
    { input: { id: string } }
  >(TENANT_CANCEL);

  const [leaveMutation, leaveState] = useMutation<
    { tenant: { users: { leave: MutationResult } } },
    { input: { tenantId: string } }
  >(TENANT_LEAVE);

  // Computed data
  const pendingApplications = (appsQuery.data?.tenant.applications ?? []).filter((a) => a.status === 'PENDING');

  // Actions
  const clearError = useCallback(() => setError(null), []);

  const refetchAll = useCallback(async () => {
    await Promise.all([mineQuery.refetch(), appsQuery.refetch(), cooldownQuery.refetch()]);
    if (debouncedSearch.length > 0) {
      await availableQuery.refetch();
    }
  }, [mineQuery, appsQuery, cooldownQuery, availableQuery, debouncedSearch]);

  const apply = useCallback(
    async (tenantId: string, message?: string): Promise<ApplyResult | undefined> => {
      setError(null);
      try {
        const result = await applyMutation({
          variables: { input: { tenantId, message: message || null } },
        });

        const applyResult = result.data?.tenant.users.apply;
        if (!applyResult?.success) {
          const errorMsg = applyResult?.message || 'Apply failed';
          setError(errorMsg);
          onError?.(errorMsg);
          return applyResult;
        }

        onApplySuccess?.(applyResult);
        await refetchAll();
        return applyResult;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Apply failed';
        setError(errorMsg);
        onError?.(errorMsg);
        return undefined;
      }
    },
    [applyMutation, onApplySuccess, onError, refetchAll]
  );

  const cancel = useCallback(
    async (applicationId: string): Promise<MutationResult | undefined> => {
      setError(null);
      try {
        const result = await cancelMutation({ variables: { input: { id: applicationId } } });

        const cancelResult = result.data?.tenant.users.cancel;
        if (!cancelResult?.success) {
          const errorMsg = cancelResult?.message || 'Cancel failed';
          setError(errorMsg);
          onError?.(errorMsg);
          return cancelResult;
        }

        onCancelSuccess?.();
        await refetchAll();
        return cancelResult;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Cancel failed';
        setError(errorMsg);
        onError?.(errorMsg);
        return undefined;
      }
    },
    [cancelMutation, onCancelSuccess, onError, refetchAll]
  );

  const leave = useCallback(
    async (tenantId: string): Promise<MutationResult | undefined> => {
      setError(null);
      try {
        const result = await leaveMutation({ variables: { input: { tenantId } } });

        const leaveResult = result.data?.tenant.users.leave;
        if (!leaveResult?.success) {
          const errorMsg = leaveResult?.message || 'Leave failed';
          setError(errorMsg);
          onError?.(errorMsg);
          return leaveResult;
        }

        onLeaveSuccess?.();
        await refetchAll();
        return leaveResult;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Leave failed';
        setError(errorMsg);
        onError?.(errorMsg);
        return undefined;
      }
    },
    [leaveMutation, onLeaveSuccess, onError, refetchAll]
  );

  const loadMore = useCallback(() => {
    const currentData = availableQuery.data?.tenant.available;
    if (!currentData?.hasMore) return;

    const currentOffset = currentData.items.length;

    availableQuery.fetchMore({
      variables: {
        input: {
          search: debouncedSearch || null,
          limit: pageSize,
          offset: currentOffset,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          tenant: {
            ...prev.tenant,
            available: {
              ...fetchMoreResult.tenant.available,
              items: [...prev.tenant.available.items, ...fetchMoreResult.tenant.available.items],
            },
          },
        };
      },
    });
  }, [availableQuery, debouncedSearch, pageSize]);

  return {
    // Data
    myTenants: mineQuery.data?.tenant.mine ?? [],
    pendingApplications,
    availableTenants: availableItems,
    globalCooldown: cooldownQuery.data?.tenant.cooldown ?? null,
    cooldownByTenantId,

    // Loading states
    isLoadingMine: mineQuery.loading,
    isLoadingApplications: appsQuery.loading,
    isLoadingAvailable: availableQuery.loading,
    isApplying: applyState.loading,
    isCancelling: cancelState.loading,
    isLeaving: leaveState.loading,

    // Error states
    error,
    clearError,

    // Search
    search,
    setSearch,
    hasMore: availableQuery.data?.tenant.available.hasMore ?? false,
    loadMore,

    // Actions
    apply,
    cancel,
    leave,
    refetchAll,
  };
}
