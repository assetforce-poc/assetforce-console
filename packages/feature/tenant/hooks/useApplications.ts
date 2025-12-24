'use client';

import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';

import type {
  ApplicationItem,
  ListApplicationsResponse,
  ListApplicationsVariables,
} from './operations';
import { LIST_APPLICATIONS } from './operations';

export interface UseApplicationsOptions {
  tenantId: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  skip?: boolean;
}

export interface UseApplicationsResult {
  data: ApplicationItem[] | null;
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

/**
 * Hook to list tenant applications (admin only).
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useApplications({
 *   tenantId: 'earth',
 *   status: 'PENDING',
 * });
 *
 * if (loading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 *
 * return (
 *   <ApplicationList
 *     applications={data || []}
 *     onApprove={handleApprove}
 *     onReject={handleReject}
 *   />
 * );
 * ```
 */
export function useApplications(options: UseApplicationsOptions): UseApplicationsResult {
  const { tenantId, status, skip = false } = options;

  const variables = useMemo(
    (): ListApplicationsVariables => ({
      input: {
        tenantId,
        status,
      },
    }),
    [tenantId, status]
  );

  const { data, loading, error, refetch } = useQuery<ListApplicationsResponse, ListApplicationsVariables>(
    LIST_APPLICATIONS,
    {
      variables,
      skip: skip || !tenantId,
      fetchPolicy: 'cache-and-network',
    }
  );

  const applications = useMemo((): ApplicationItem[] | null => {
    if (!data?.tenant?.applicationsList) return null;
    return data.tenant.applicationsList;
  }, [data]);

  return {
    data: applications,
    loading,
    error,
    refetch,
  };
}

export default useApplications;
