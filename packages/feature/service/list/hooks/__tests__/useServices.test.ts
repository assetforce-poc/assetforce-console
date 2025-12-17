import { renderHook, waitFor } from '@testing-library/react';

import { useServices } from '../useServices';

// Mock @assetforce/graphql
jest.mock('@assetforce/graphql', () => ({
  useQuery: jest.fn(),
}));

// Import after mocking
import { useQuery } from '@assetforce/graphql';

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

describe('useServices', () => {
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

      const { result } = renderHook(() => useServices());

      expect(result.current.loading).toBe(true);
      expect(result.current.services).toEqual([]);
      expect(result.current.pagination).toBeNull();
    });
  });

  describe('when data is loaded', () => {
    it('should return services and pagination info', () => {
      const mockData = {
        service: {
          list: {
            items: [
              { id: '1', slug: 'service-a', displayName: 'Service A' },
              { id: '2', slug: 'service-b', displayName: 'Service B' },
            ],
            total: 50,
            limit: 20,
            offset: 0,
          },
        },
      };

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useServices({ limit: 20, offset: 0 }));

      expect(result.current.loading).toBe(false);
      expect(result.current.services).toHaveLength(2);
      expect(result.current.total).toBe(50);
      expect(result.current.pagination).toEqual({
        current: 1,
        size: 20,
        total: 50,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      });
    });

    it('should compute correct pagination for middle page', () => {
      const mockData = {
        service: {
          list: {
            items: [],
            total: 100,
            limit: 20,
            offset: 40, // Page 3
          },
        },
      };

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useServices({ limit: 20, offset: 40 }));

      expect(result.current.pagination).toEqual({
        current: 3,
        size: 20,
        total: 100,
        totalPages: 5,
        hasNext: true,
        hasPrev: true,
      });
    });

    it('should compute correct pagination for last page', () => {
      const mockData = {
        service: {
          list: {
            items: [],
            total: 100,
            limit: 20,
            offset: 80, // Page 5 (last)
          },
        },
      };

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useServices({ limit: 20, offset: 80 }));

      expect(result.current.pagination).toEqual({
        current: 5,
        size: 20,
        total: 100,
        totalPages: 5,
        hasNext: false,
        hasPrev: true,
      });
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

      const { result } = renderHook(() => useServices());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(mockError);
      expect(result.current.services).toEqual([]);
    });
  });

  describe('query options', () => {
    it('should pass filter options to query', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      renderHook(() =>
        useServices({
          type: 'CORE',
          lifecycle: 'PRODUCTION',
          search: 'test',
          limit: 10,
          offset: 20,
        })
      );

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: {
            input: {
              type: 'CORE',
              lifecycle: 'PRODUCTION',
              search: 'test',
              page: { limit: 10, offset: 20 },
            },
          },
          skip: false,
        })
      );
    });

    it('should skip query when skip option is true', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      renderHook(() => useServices({ skip: true }));

      expect(mockUseQuery).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ skip: true }));
    });
  });
});
