/**
 * Unit tests for useAccountDetail hook
 */

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { GET_ACCOUNT_DETAIL_QUERY } from '../../detail/hooks/useAccountDetail';
import { useAccountDetail } from '../../detail/hooks/useAccountDetail';
import type { AccountDetail } from '../../detail/types';

// ============ Test Data ============

const mockAccountDetail: AccountDetail = {
  id: 'test-account-123',
  username: 'testuser',
  email: 'test@example.com',
  emailVerified: true,
  firstName: 'Test',
  lastName: 'User',
  status: 'ACTIVE',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
  attributes: [
    {
      key: 'tenantId',
      value: 'tenant-123',
      isSensitive: false,
    },
  ],
  sessions: [
    {
      id: 'session-1',
      start: '2024-01-01T10:00:00Z',
      lastAccess: '2024-01-01T12:00:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 Chrome',
    },
  ],
};

// ============ Mock Helpers ============

function createSuccessMock(accountId: string): MockedResponse {
  return {
    request: {
      query: GET_ACCOUNT_DETAIL_QUERY,
      variables: { id: accountId },
    },
    result: {
      data: {
        account: {
          one: mockAccountDetail,
        },
      },
    },
  };
}

function createNotFoundMock(accountId: string): MockedResponse {
  return {
    request: {
      query: GET_ACCOUNT_DETAIL_QUERY,
      variables: { id: accountId },
    },
    result: {
      data: {
        account: {
          one: null,
        },
      },
    },
  };
}

function createNetworkErrorMock(accountId: string): MockedResponse {
  return {
    request: {
      query: GET_ACCOUNT_DETAIL_QUERY,
      variables: { id: accountId },
    },
    error: new Error('Network error'),
  };
}

function createWrapper(mocks: MockedResponse[]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };
}

// ============ Tests ============

describe('useAccountDetail', () => {
  describe('initial state', () => {
    it('should return loading true initially', () => {
      const { result } = renderHook(() => useAccountDetail('test-id'), {
        wrapper: createWrapper([]),
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.account).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should return refetch function', () => {
      const { result } = renderHook(() => useAccountDetail('test-id'), {
        wrapper: createWrapper([]),
      });

      expect(result.current.refetch).toBeInstanceOf(Function);
    });
  });

  describe('successful query', () => {
    it('should fetch and return account detail', async () => {
      const { result } = renderHook(() => useAccountDetail('test-account-123'), {
        wrapper: createWrapper([createSuccessMock('test-account-123')]),
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.account).toEqual(mockAccountDetail);
      expect(result.current.error).toBeNull();
    });

    it('should include all account fields', async () => {
      const { result } = renderHook(() => useAccountDetail('test-account-123'), {
        wrapper: createWrapper([createSuccessMock('test-account-123')]),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const account = result.current.account!;
      expect(account.id).toBe('test-account-123');
      expect(account.username).toBe('testuser');
      expect(account.email).toBe('test@example.com');
      expect(account.emailVerified).toBe(true);
      expect(account.status).toBe('ACTIVE');
      expect(account.attributes).toHaveLength(1);
      expect(account.sessions).toHaveLength(1);
    });
  });

  describe('account not found', () => {
    it('should handle null account (not found)', async () => {
      const { result } = renderHook(() => useAccountDetail('non-existent-id'), {
        wrapper: createWrapper([createNotFoundMock('non-existent-id')]),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.account).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const { result } = renderHook(() => useAccountDetail('test-id'), {
        wrapper: createWrapper([createNetworkErrorMock('test-id')]),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.account).toBeNull();
      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toContain('Network error');
    });
  });

  describe('refetch', () => {
    it('should refetch account detail when refetch is called', async () => {
      const mocks = [
        createSuccessMock('test-account-123'),
        createSuccessMock('test-account-123'), // Second call for refetch
      ];

      const { result } = renderHook(() => useAccountDetail('test-account-123'), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.account).toEqual(mockAccountDetail);

      // Trigger refetch
      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.account).toEqual(mockAccountDetail);
      });
    });
  });

  describe('different account IDs', () => {
    it('should fetch different accounts when ID changes', async () => {
      const mocks = [createSuccessMock('account-1'), createSuccessMock('account-2')];

      const { result, rerender } = renderHook(({ id }) => useAccountDetail(id), {
        initialProps: { id: 'account-1' },
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.account).toEqual(mockAccountDetail);

      // Change account ID
      rerender({ id: 'account-2' });

      await waitFor(() => {
        expect(result.current.account).toEqual(mockAccountDetail);
      });
    });
  });
});
