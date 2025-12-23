import { renderHook } from '@testing-library/react';

import { useInvites } from '../useInvites';

// Mock @apollo/client/react
jest.mock('@apollo/client/react', () => ({
  useQuery: jest.fn(),
}));

import { useQuery } from '@apollo/client/react';

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

describe('useInvites', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when loading', () => {
    it('should return loading state', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useInvites({ tenantId: 'tenant-001' }));

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();
    });
  });

  describe('when data is loaded', () => {
    it('should return invites list with pagination', () => {
      const mockData = {
        tenant: {
          invites: {
            items: [
              {
                id: 'invite-1',
                tenantId: 'tenant-001',
                tenantName: 'Test Tenant',
                invitedEmail: 'user1@example.com',
                inviterEmail: 'admin@example.com',
                role: 'member',
                status: 'PENDING',
                expiresAt: '2025-01-01T00:00:00Z',
                createdAt: '2024-12-24T00:00:00Z',
                updatedAt: '2024-12-24T00:00:00Z',
              },
              {
                id: 'invite-2',
                tenantId: 'tenant-001',
                tenantName: 'Test Tenant',
                invitedEmail: 'user2@example.com',
                inviterEmail: 'admin@example.com',
                role: 'admin',
                status: 'ACCEPTED',
                expiresAt: '2025-01-01T00:00:00Z',
                createdAt: '2024-12-23T00:00:00Z',
                updatedAt: '2024-12-24T00:00:00Z',
              },
            ],
            total: 10,
            hasMore: true,
          },
        },
      };

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() =>
        useInvites({ tenantId: 'tenant-001', limit: 10, offset: 0 })
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.data?.items).toHaveLength(2);
      expect(result.current.data?.total).toBe(10);
      expect(result.current.data?.hasMore).toBe(true);
    });

    it('should filter by status when provided', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      renderHook(() =>
        useInvites({ tenantId: 'tenant-001', status: 'PENDING' })
      );

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: {
            input: {
              tenantId: 'tenant-001',
              status: 'PENDING',
              limit: 20,
              offset: 0,
            },
          },
        })
      );
    });
  });

  describe('when error occurs', () => {
    it('should return error state', () => {
      const mockError = new Error('Network error');

      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: mockError,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useInvites({ tenantId: 'tenant-001' }));

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(mockError);
    });
  });

  describe('pagination options', () => {
    it('should use default pagination when not provided', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      renderHook(() => useInvites({ tenantId: 'tenant-001' }));

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: {
            input: {
              tenantId: 'tenant-001',
              limit: 20,
              offset: 0,
            },
          },
        })
      );
    });

    it('should use custom pagination when provided', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      renderHook(() => useInvites({ tenantId: 'tenant-001', limit: 50, offset: 100 }));

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: {
            input: {
              tenantId: 'tenant-001',
              limit: 50,
              offset: 100,
            },
          },
        })
      );
    });
  });

  describe('refetch', () => {
    it('should provide refetch function', () => {
      const mockRefetch = jest.fn();

      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      } as any);

      const { result } = renderHook(() => useInvites({ tenantId: 'tenant-001' }));

      result.current.refetch();
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('empty results', () => {
    it('should handle empty invite list', () => {
      const mockData = {
        tenant: {
          invites: {
            items: [],
            total: 0,
            hasMore: false,
          },
        },
      };

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useInvites({ tenantId: 'tenant-001' }));

      expect(result.current.data?.items).toHaveLength(0);
      expect(result.current.data?.total).toBe(0);
      expect(result.current.data?.hasMore).toBe(false);
    });
  });
});
