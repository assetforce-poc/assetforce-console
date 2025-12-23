'use client';

import { useQuery } from '@apollo/client/react';

import type { GetTenantResponse, GetTenantVariables, TenantItem } from './operations';
import { GET_TENANT } from './operations';

interface UseTenantResult {
  tenant: TenantItem | null;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

/**
 * Hook to get a single tenant by ID.
 */
export function useTenant(id: string): UseTenantResult {
  const { data, loading, error, refetch } = useQuery<GetTenantResponse, GetTenantVariables>(GET_TENANT, {
    variables: { id },
    skip: !id,
  });

  return {
    tenant: data?.tenant.one ?? null,
    loading,
    error: error ? new Error(error.message) : undefined,
    refetch,
  };
}
