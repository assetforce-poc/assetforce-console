import { renderHook, waitFor } from '@testing-library/react';

import { useApplications } from '../useApplications';

// Mock @apollo/client/react
jest.mock('@apollo/client/react', () => ({
  useQuery: jest.fn(),
}));

import { useQuery } from '@apollo/client/react';

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

describe('useApplications', () => {
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return loading true while fetching', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: undefined,
        refetch: mockRefetch,
      } as any);

      const { result } = renderHook(() =>
        useApplications({ tenantId: 'tenant-001' })
      );

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('when applications loaded successfully', () => {
    it('should return applications data', () => {
      const mockApplications = [
        {
          id: 'app-001',
          subject: 'user-123',
          applicant: { name: 'John Doe', email: 'john@example.com' },
          status: 'PENDING',
          message: 'I want to join',
          createdAt: '2024-12-24T00:00:00Z',
          updatedAt: '2024-12-24T00:00:00Z',
          tenant: { id: 'tenant-001', name: 'Test Tenant' },
        },
      ];

      mockUseQuery.mockReturnValue({
        data: {
          tenant: {
            applicationsList: mockApplications,
          },
        },
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      } as any);

      const { result } = renderHook(() =>
        useApplications({ tenantId: 'tenant-001' })
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toHaveLength(1);
      const firstApp = result.current.data?.[0];
      expect(firstApp?.id).toBe('app-001');
      expect(firstApp?.applicant?.name).toBe('John Doe');
      expect(firstApp?.applicant?.email).toBe('john@example.com');
    });

    it('should return empty array when no applications', () => {
      mockUseQuery.mockReturnValue({
        data: {
          tenant: {
            applicationsList: [],
          },
        },
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      } as any);

      const { result } = renderHook(() =>
        useApplications({ tenantId: 'tenant-001' })
      );

      expect(result.current.data).toEqual([]);
    });
  });

  describe('when filtering by status', () => {
    it('should pass status filter to query', () => {
      mockUseQuery.mockReturnValue({
        data: {
          tenant: {
            applicationsList: [],
          },
        },
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      } as any);

      renderHook(() =>
        useApplications({ tenantId: 'tenant-001', status: 'PENDING' })
      );

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: {
            input: {
              tenantId: 'tenant-001',
              status: 'PENDING',
            },
          },
        })
      );
    });
  });

  describe('when skipped', () => {
    it('should skip query when skip option is true', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      } as any);

      renderHook(() =>
        useApplications({ tenantId: 'tenant-001', skip: true })
      );

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          skip: true,
        })
      );
    });

    it('should skip query when tenantId is empty', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      } as any);

      renderHook(() => useApplications({ tenantId: '' }));

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          skip: true,
        })
      );
    });
  });

  describe('when error occurs', () => {
    it('should return error', () => {
      const mockError = new Error('Network error');

      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: mockError,
        refetch: mockRefetch,
      } as any);

      const { result } = renderHook(() =>
        useApplications({ tenantId: 'tenant-001' })
      );

      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBeNull();
    });
  });

  describe('refetch', () => {
    it('should expose refetch function', () => {
      mockUseQuery.mockReturnValue({
        data: {
          tenant: {
            applicationsList: [],
          },
        },
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      } as any);

      const { result } = renderHook(() =>
        useApplications({ tenantId: 'tenant-001' })
      );

      expect(typeof result.current.refetch).toBe('function');
      result.current.refetch();
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});
