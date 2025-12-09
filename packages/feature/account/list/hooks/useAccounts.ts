'use client';

import { useQuery } from '@assetforce/graphql';
import { useMemo } from 'react';

import { ListAccountsDocument as LIST_ACCOUNTS_QUERY } from '../../generated/graphql';
import type { AccountConnection, AccountStatus, ListQueriesInput } from '../types';

export interface UseAccountsOptions {
  /** Filter by account status */
  status?: AccountStatus;
  /** Search query string */
  search?: string;
  /** Current page number (1-indexed) */
  page?: number;
  /** Number of items per page */
  size?: number;
  /** Skip query execution */
  skip?: boolean;
}

export interface UseAccountsReturn {
  /** Account connection data */
  data: AccountConnection | undefined;
  /** Loading state */
  loading: boolean;
  /** Error if any */
  error: Error | undefined;
  /** Refetch accounts */
  refetch: () => Promise<void>;
}

/**
 * useAccounts Hook - Fetch and manage account listing
 *
 * Provides account listing with filtering, searching, and pagination.
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useAccounts({
 *   status: AccountStatus.ACTIVE,
 *   page: 1,
 *   size: 20,
 * });
 *
 * if (loading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 *
 * return (
 *   <AccountList
 *     accounts={data.items}
 *     pagination={data.pagination}
 *     onPageChange={(page) => setPage(page)}
 *   />
 * );
 * ```
 */
export function useAccounts(options: UseAccountsOptions = {}): UseAccountsReturn {
  const { status, search, page = 1, size = 20, skip = false } = options;

  const queries: ListQueriesInput | undefined = useMemo(() => {
    const hasQueries = search || page !== 1 || size !== 20;
    if (!hasQueries && !status) return undefined;

    return {
      pagination: {
        page,
        size,
      },
      search: search ? { query: search } : undefined,
    };
  }, [search, page, size]);

  const { data, loading, error, refetch } = useQuery<
    { account: { list: AccountConnection } },
    { status?: AccountStatus; queries?: ListQueriesInput }
  >(LIST_ACCOUNTS_QUERY, {
    variables: { status, queries },
    skip,
  });

  const accountConnection = useMemo(() => data?.account?.list, [data]);

  return {
    data: accountConnection,
    loading,
    error: error as Error | undefined,
    refetch: async () => {
      await refetch();
    },
  };
}
