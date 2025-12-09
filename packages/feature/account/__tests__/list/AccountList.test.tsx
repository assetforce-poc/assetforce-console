/**
 * Component tests for AccountList
 */

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

import { ListAccountsDocument as LIST_ACCOUNTS_QUERY } from '../../generated/graphql';
import { AccountList } from '../../list/components/AccountList';
import type { AccountConnection } from '../../list/types';
import { AccountStatus } from '../../list/types';

// ============ Mock Data ============

const mockAccounts: AccountConnection = {
  items: [
    {
      id: 'acc-1',
      username: 'activeuser',
      email: 'active@example.com',
      status: AccountStatus.ACTIVE,
      emailVerified: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'acc-2',
      username: 'pendinguser',
      email: 'pending@example.com',
      status: AccountStatus.PENDING_VERIFICATION,
      emailVerified: false,
      createdAt: '2024-01-02T00:00:00Z',
    },
    {
      id: 'acc-3',
      username: 'lockeduser',
      email: 'locked@example.com',
      status: AccountStatus.LOCKED,
      emailVerified: true,
      createdAt: '2024-01-03T00:00:00Z',
    },
  ],
  total: 3,
  pagination: {
    current: 1,
    size: 20,
    total: 1,
    hasNext: false,
    hasPrev: false,
  },
};

const emptyAccounts: AccountConnection = {
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

function createSuccessMock(): MockedResponse {
  return {
    request: {
      query: LIST_ACCOUNTS_QUERY,
      variables: {},
    },
    result: {
      data: {
        account: {
          list: mockAccounts,
        },
      },
    },
  };
}

function createEmptyMock(): MockedResponse {
  return {
    request: {
      query: LIST_ACCOUNTS_QUERY,
      variables: {},
    },
    result: {
      data: {
        account: {
          list: emptyAccounts,
        },
      },
    },
  };
}

function createErrorMock(): MockedResponse {
  return {
    request: {
      query: LIST_ACCOUNTS_QUERY,
      variables: {},
    },
    error: new Error('Failed to load accounts'),
  };
}

function createWrapper(mocks: MockedResponse[]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };
}

// ============ Tests ============

describe('AccountList', () => {
  describe('loading state', () => {
    it('should show loading spinner while fetching', () => {
      render(<AccountList />, {
        wrapper: createWrapper([createSuccessMock()]),
      });

      // MUI CircularProgress is shown during loading
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('successful data display', () => {
    it('should render account table with data', async () => {
      render(<AccountList />, {
        wrapper: createWrapper([createSuccessMock()]),
      });

      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // Check table headers
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Email Verified')).toBeInTheDocument();
      expect(screen.getByText('Created At')).toBeInTheDocument();

      // Check data rows
      expect(screen.getByText('activeuser')).toBeInTheDocument();
      expect(screen.getByText('active@example.com')).toBeInTheDocument();
      expect(screen.getByText('pendinguser')).toBeInTheDocument();
      expect(screen.getByText('pending@example.com')).toBeInTheDocument();
      expect(screen.getByText('lockeduser')).toBeInTheDocument();
      expect(screen.getByText('locked@example.com')).toBeInTheDocument();
    });

    it('should render status badges for each account', async () => {
      render(<AccountList />, {
        wrapper: createWrapper([createSuccessMock()]),
      });

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // Check status badges are rendered
      expect(screen.getByTestId('account-status-active')).toBeInTheDocument();
      expect(screen.getByTestId('account-status-pending_verification')).toBeInTheDocument();
      expect(screen.getByTestId('account-status-locked')).toBeInTheDocument();
    });

    it('should render pagination controls', async () => {
      render(<AccountList />, {
        wrapper: createWrapper([createSuccessMock()]),
      });

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // Check pagination is present
      const pagination = screen.getByTestId('account-list-pagination');
      expect(pagination).toBeInTheDocument();
      expect(screen.getByText('1–3 of 3')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should show empty message when no accounts', async () => {
      render(<AccountList />, {
        wrapper: createWrapper([createEmptyMock()]),
      });

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('account-list-empty')).toBeInTheDocument();
      expect(screen.getByText('No accounts found.')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error message on fetch failure', async () => {
      render(<AccountList />, {
        wrapper: createWrapper([createErrorMock()]),
      });

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('account-list-error')).toBeInTheDocument();
      expect(screen.getByText(/Failed to load accounts/)).toBeInTheDocument();
    });
  });

  describe('filtering', () => {
    it('should pass status filter to query', async () => {
      const filterMock: MockedResponse = {
        request: {
          query: LIST_ACCOUNTS_QUERY,
          variables: {
            status: AccountStatus.ACTIVE,
            queries: {
              pagination: { page: 1, size: 20 },
              search: undefined,
            },
          },
        },
        result: {
          data: {
            account: {
              list: {
                items: [mockAccounts.items[0]],
                total: 1,
                pagination: {
                  current: 1,
                  size: 20,
                  total: 1,
                  hasNext: false,
                  hasPrev: false,
                },
              },
            },
          },
        },
      };

      render(<AccountList status={AccountStatus.ACTIVE} />, {
        wrapper: createWrapper([filterMock]),
      });

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // Verify query was called with status filter (data loaded successfully)
      expect(screen.queryByTestId('account-list-error')).not.toBeInTheDocument();
      expect(screen.getByTestId('account-list')).toBeInTheDocument();
    });

    it('should pass search filter to query', async () => {
      const searchMock: MockedResponse = {
        request: {
          query: LIST_ACCOUNTS_QUERY,
          variables: {
            status: undefined,
            queries: {
              pagination: { page: 1, size: 20 },
              search: { query: 'active' },
            },
          },
        },
        result: {
          data: {
            account: {
              list: {
                items: [mockAccounts.items[0]],
                total: 1,
                pagination: {
                  current: 1,
                  size: 20,
                  total: 1,
                  hasNext: false,
                  hasPrev: false,
                },
              },
            },
          },
        },
      };

      render(<AccountList search="active" />, {
        wrapper: createWrapper([searchMock]),
      });

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // Verify query was called with search filter (indicated by no mock error)
      expect(screen.queryByTestId('account-list-error')).not.toBeInTheDocument();
    });
  });
});
