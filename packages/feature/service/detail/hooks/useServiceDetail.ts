'use client';

import { useQuery } from '@assetforce/graphql';

import { GetServiceDetailDocument } from '../../generated/graphql';

export interface UseServiceDetailOptions {
  /** Skip query execution */
  skip?: boolean;
}

/**
 * useServiceDetail Hook - Fetch service detail by slug
 *
 * @example
 * ```tsx
 * const { service, loading, error, refetch } = useServiceDetail('aac-service');
 * ```
 */
export function useServiceDetail(slug: string, options: UseServiceDetailOptions = {}) {
  const { skip = false } = options;

  const { data, loading, error, refetch } = useQuery(GetServiceDetailDocument, {
    variables: {
      input: { slug },
    },
    skip: !slug || skip,
  });

  return {
    service: data?.service?.one,
    loading,
    error: error as Error | undefined,
    refetch: async () => {
      await refetch();
    },
  };
}
