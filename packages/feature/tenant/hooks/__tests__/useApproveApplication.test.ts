import { act, renderHook } from '@testing-library/react';

import { useApproveApplication } from '../useApproveApplication';

// Mock @apollo/client/react
jest.mock('@apollo/client/react', () => ({
  useMutation: jest.fn(),
}));

import { useMutation } from '@apollo/client/react';

const mockUseMutation = useMutation as jest.MockedFunction<typeof useMutation>;

describe('useApproveApplication', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMutation.mockReturnValue([mockMutate, { loading: false }] as any);
  });

  describe('initial state', () => {
    it('should return initial state with loading false', () => {
      const { result } = renderHook(() => useApproveApplication());

      expect(result.current.loading).toBe(false);
      expect(typeof result.current.approve).toBe('function');
    });
  });

  describe('when approving application successfully', () => {
    it('should return success result', async () => {
      const mockResponse = {
        data: {
          tenant: {
            application: {
              approve: {
                success: true,
                message: null,
                application: {
                  id: 'app-001',
                  status: 'APPROVED',
                },
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useApproveApplication());

      let approveResult: any;
      await act(async () => {
        approveResult = await result.current.approve('app-001');
      });

      expect(approveResult.success).toBe(true);
      expect(mockMutate).toHaveBeenCalledWith({
        variables: {
          input: { applicationId: 'app-001' },
        },
      });
    });
  });

  describe('when application not found', () => {
    it('should return error result', async () => {
      const mockResponse = {
        data: {
          tenant: {
            application: {
              approve: {
                success: false,
                message: 'application not found',
                application: null,
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useApproveApplication());

      let approveResult: any;
      await act(async () => {
        approveResult = await result.current.approve('non-existent');
      });

      expect(approveResult.success).toBe(false);
      expect(approveResult.message).toBe('application not found');
    });
  });

  describe('when application is not pending', () => {
    it('should return error result', async () => {
      const mockResponse = {
        data: {
          tenant: {
            application: {
              approve: {
                success: false,
                message: 'application is not pending',
                application: null,
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useApproveApplication());

      let approveResult: any;
      await act(async () => {
        approveResult = await result.current.approve('app-already-approved');
      });

      expect(approveResult.success).toBe(false);
      expect(approveResult.message).toBe('application is not pending');
    });
  });

  describe('when mutation fails', () => {
    it('should return error result', async () => {
      mockMutate.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useApproveApplication());

      let approveResult: any;
      await act(async () => {
        approveResult = await result.current.approve('app-001');
      });

      expect(approveResult.success).toBe(false);
      expect(approveResult.message).toBe('Network error');
    });
  });

  describe('when response is unexpected', () => {
    it('should return unexpected response error', async () => {
      const mockResponse = {
        data: {
          tenant: {
            application: null,
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useApproveApplication());

      let approveResult: any;
      await act(async () => {
        approveResult = await result.current.approve('app-001');
      });

      expect(approveResult.success).toBe(false);
      expect(approveResult.message).toBe('Unexpected response');
    });
  });

  describe('loading state', () => {
    it('should reflect loading state from mutation', () => {
      mockUseMutation.mockReturnValue([mockMutate, { loading: true }] as any);

      const { result } = renderHook(() => useApproveApplication());

      expect(result.current.loading).toBe(true);
    });
  });
});
