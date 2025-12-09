/**
 * Unit tests for useAccounts hook
 */

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { ListAccountsDocument as LIST_ACCOUNTS_QUERY } from '../../generated/graphql';
import { useAccounts } from '../../list/hooks/useAccounts';
import type { AccountConnection, ListQueriesInput } from '../../list/types';
import { AccountStatus } from '../../list/types';

// ============ Test Data ============

const mockAccountConnection: AccountConnection = {
  items: [
    {
      id: 'acc-1',
      username: 'user1',
      email: 'user1@example.com',
      status: AccountStatus.ACTIVE,
      emailVerified: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'acc-2',
      username: 'user2',
      email: 'user2@example.com',
      status: AccountStatus.PENDING_VERIFICATION,
      emailVerified: false,
      createdAt: '2024-01-02T00:00:00Z',
    },
  ],
  total: 2,
  pagination: {
    current: 1,
    size: 20,
    total: 1,
    hasNext: false,
    hasPrev: false,
  },
};

const emptyConnection: AccountConnection = {
  items: [],
  total: 0,
  pagination: {
    current: 1,
    size: 20,
    total: 0,
    hasNext: false,
    hasPrev: false,
  },
};

// ============ Mock Helpers ============

function createSuccessMock(status?: AccountStatus, queries?: ListQueriesInput): MockedResponse {
  return {
    request: {
      query: LIST_ACCOUNTS_QUERY,
      variables: { status, queries },
    },
    result: {
      data: {
        account: {
          list: mockAccountConnection,
        },
      },
    },
  };
}

function createEmptyMock(status?: AccountStatus, queries?: ListQueriesInput): MockedResponse {
  return {
    request: {
      query: LIST_ACCOUNTS_QUERY,
      variables: { status, queries },
    },
    result: {
      data: {
        account: {
          list: emptyConnection,
        },
      },
    },
  };
}

function createErrorMock(status?: AccountStatus, queries?: ListQueriesInput): MockedResponse {
  return {
    request: {
      query: LIST_ACCOUNTS_QUERY,
      variables: { status, queries },
    },
    error: new Error('Failed to fetch accounts'),
  };
}

function createWrapper(mocks: MockedResponse[]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };
}

// ============ Tests ============

describe('useAccounts', () => {
  describe('successful data fetching', () => {
    it('should fetch and return account list', async () => {
      const { result } = renderHook(() => useAccounts(), {
        wrapper: createWrapper([createSuccessMock()]),
      });

      // Initially loading
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();

      // Wait for data
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockAccountConnection);
      expect(result.current.data?.items).toHaveLength(2);
      expect(result.current.data?.total).toBe(2);
      expect(result.current.error).toBeUndefined();
    });

    it('should fetch accounts with status filter', async () => {
      const queries: ListQueriesInput = {
        pagination: { page: 1, size: 20 },
      };

      const { result } = renderHook(
        () =>
          useAccounts({
            status: AccountStatus.ACTIVE,
          }),
        {
          wrapper: createWrapper([createSuccessMock(AccountStatus.ACTIVE, queries)]),
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockAccountConnection);
      expect(result.current.error).toBeUndefined();
    });

    it('should fetch accounts with pagination', async () => {
      const queries: ListQueriesInput = {
        pagination: { page: 2, size: 10 },
      };

      const { result } = renderHook(
        () =>
          useAccounts({
            page: 2,
            size: 10,
          }),
        {
          wrapper: createWrapper([createSuccessMock(undefined, queries)]),
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockAccountConnection);
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('empty results', () => {
    it('should handle empty account list', async () => {
      const { result } = renderHook(() => useAccounts(), {
        wrapper: createWrapper([createEmptyMock()]),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(emptyConnection);
      expect(result.current.data?.items).toHaveLength(0);
      expect(result.current.data?.total).toBe(0);
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should handle query errors', async () => {
      const { result } = renderHook(() => useAccounts(), {
        wrapper: createWrapper([createErrorMock()]),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe('Failed to fetch accounts');
    });
  });

  describe('skip option', () => {
    it('should not execute query when skip is true', () => {
      const { result } = renderHook(() => useAccounts({ skip: true }), {
        wrapper: createWrapper([]),
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });
  });
});
