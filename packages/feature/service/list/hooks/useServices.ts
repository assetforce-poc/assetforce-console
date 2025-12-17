'use client';

import { useQuery } from '@assetforce/graphql';
import { useMemo } from 'react';

import { ListServicesDocument } from '../../generated/graphql';
import type { ServiceLifecycle, ServiceType } from '../types';

export interface UseServicesOptions {
  /** Filter by service type */
  type?: ServiceType;
  /** Filter by lifecycle stage */
  lifecycle?: ServiceLifecycle;
  /** Search by slug or displayName */
  search?: string;
  /** Number of items per page */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Skip query execution */
  skip?: boolean;
}

export interface PaginationInfo {
  current: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UseServicesReturn {
  /** Service items */
  services: ReturnType<typeof useQuery>['data'] extends infer D
    ? D extends { service: { list: { items: infer I } } }
      ? I
      : never[]
    : never[];
  /** Pagination info computed from limit/offset */
  pagination: PaginationInfo | null;
  /** Total count */
  total: number;
  /** Loading state */
  loading: boolean;
  /** Error if any */
  error: Error | undefined;
  /** Refetch services */
  refetch: () => Promise<void>;
}

/**
 * useServices Hook - Fetch and manage service listing
 *
 * Provides service listing with filtering, searching, and pagination.
 *
 * @example
 * ```tsx
 * const { services, loading, error, pagination, refetch } = useServices({
 *   type: 'CORE',
 *   lifecycle: 'PRODUCTION',
 *   limit: 20,
 *   offset: 0,
 * });
 * ```
 */
export function useServices(options: UseServicesOptions = {}): UseServicesReturn {
  const { type, lifecycle, search, limit = 20, offset = 0, skip = false } = options;

  const { data, loading, error, refetch } = useQuery(ListServicesDocument, {
    variables: {
      input: {
        type,
        lifecycle,
        search,
        page: { limit, offset },
      },
    },
    skip,
  });

  const services = useMemo(() => data?.service?.list?.items ?? [], [data]);
  const total = useMemo(() => data?.service?.list?.total ?? 0, [data]);

  // Compute pagination info from limit/offset
  const pagination = useMemo((): PaginationInfo | null => {
    if (!data?.service?.list) return null;
    const { total: t, limit: l, offset: o } = data.service.list;
    const currentPage = Math.floor(o / l) + 1;
    const totalPages = Math.ceil(t / l);
    return {
      current: currentPage,
      size: l,
      total: t,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    };
  }, [data]);

  return {
    services,
    pagination,
    total,
    loading,
    error: error as Error | undefined,
    refetch: async () => {
      await refetch();
    },
  };
}
