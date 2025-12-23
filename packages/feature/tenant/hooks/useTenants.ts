'use client';

import { useQuery } from '@apollo/client/react';

import { LIST_TENANTS } from './operations';
import type { ListTenantsResponse, TenantItem } from './operations';

interface UseTenantsResult {
  tenants: TenantItem[];
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

/**
 * Hook to list all tenants.
 * Admin only.
 */
export function useTenants(): UseTenantsResult {
  const { data, loading, error, refetch } = useQuery<ListTenantsResponse>(LIST_TENANTS);

  return {
    tenants: data?.tenant.list ?? [],
    loading,
    error: error ? new Error(error.message) : undefined,
    refetch,
  };
}
