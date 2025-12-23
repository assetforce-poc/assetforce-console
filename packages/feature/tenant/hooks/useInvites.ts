'use client';

import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';

import type { InviteItem, ListInvitesResponse, ListInvitesVariables } from './operations';
import { LIST_INVITES } from './operations';

export interface UseInvitesOptions {
  tenantId?: string;
  status?: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
  limit?: number;
  offset?: number;
  skip?: boolean;
}

export interface InvitesConnection {
  items: InviteItem[];
  total: number;
  hasMore: boolean;
}

export interface UseInvitesResult {
  data: InvitesConnection | null;
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

/**
 * Hook to list tenant invites (admin only).
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useInvites({
 *   tenantId: 'earth',
 *   status: 'PENDING',
 *   limit: 20,
 * });
 *
 * if (loading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 *
 * return (
 *   <InviteList
 *     invites={data?.items || []}
 *     total={data?.total || 0}
 *   />
 * );
 * ```
 */
export function useInvites(options: UseInvitesOptions = {}): UseInvitesResult {
  const { tenantId, status, limit = 20, offset = 0, skip = false } = options;

  const variables = useMemo(
    (): ListInvitesVariables => ({
      input: {
        tenantId,
        status,
        limit,
        offset,
      },
    }),
    [tenantId, status, limit, offset]
  );

  const { data, loading, error, refetch } = useQuery<ListInvitesResponse, ListInvitesVariables>(LIST_INVITES, {
    variables,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  const invitesConnection = useMemo((): InvitesConnection | null => {
    if (!data?.tenant?.invites) return null;
    return data.tenant.invites;
  }, [data]);

  return {
    data: invitesConnection,
    loading,
    error,
    refetch,
  };
}

export default useInvites;
