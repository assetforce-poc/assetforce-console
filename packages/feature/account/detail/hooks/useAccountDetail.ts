'use client';

import { useQuery } from '@assetforce/graphql';

import type { GetAccountDetailQuery } from '../../generated/graphql';
import { GetAccountDetailDocument as GET_ACCOUNT_DETAIL_QUERY } from '../../generated/graphql';

// Export for testing
export { GET_ACCOUNT_DETAIL_QUERY };

export interface UseAccountDetailReturn {
  /** Account detail data */
  account: GetAccountDetailQuery['account']['one'] | null;
  /** Loading state */
  loading: boolean;
  /** Error if any */
  error: Error | undefined;
  /** Refetch account detail */
  refetch: () => Promise<void>;
}

/**
 * useAccountDetail Hook - Fetch account detail by ID
 *
 * Provides account detail information including basic info, attributes, and sessions.
 *
 * @param accountId - The account ID to fetch
 *
 * @example
 * ```tsx
 * const { account, loading, error, refetch } = useAccountDetail('account-id');
 *
 * if (loading) return <Loading />;
 * if (error || !account) return <Error />;
 *
 * return (
 *   <AccountDetail account={account} onRefresh={refetch} />
 * );
 * ```
 */
export function useAccountDetail(accountId: string): UseAccountDetailReturn {
  const { data, loading, error, refetch } = useQuery(GET_ACCOUNT_DETAIL_QUERY, {
    variables: { id: accountId },
    skip: !accountId,
    fetchPolicy: 'network-only', // Always fetch fresh data
  });

  return {
    account: data?.account?.one ?? null,
    loading,
    error,
    refetch: async () => {
      await refetch();
    },
  };
}
