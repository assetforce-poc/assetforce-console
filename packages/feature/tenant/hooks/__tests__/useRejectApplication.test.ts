import { act, renderHook } from '@testing-library/react';

import { useRejectApplication } from '../useRejectApplication';

// Mock @apollo/client/react
jest.mock('@apollo/client/react', () => ({
  useMutation: jest.fn(),
}));

import { useMutation } from '@apollo/client/react';

const mockUseMutation = useMutation as jest.MockedFunction<typeof useMutation>;

describe('useRejectApplication', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMutation.mockReturnValue([mockMutate, { loading: false }] as any);
  });

  describe('initial state', () => {
    it('should return initial state with loading false', () => {
      const { result } = renderHook(() => useRejectApplication());

      expect(result.current.loading).toBe(false);
      expect(typeof result.current.reject).toBe('function');
    });
  });

  describe('when rejecting application successfully', () => {
    it('should return success result', async () => {
      const mockResponse = {
        data: {
          tenant: {
            application: {
              reject: {
                success: true,
                message: null,
                application: {
                  id: 'app-001',
                  status: 'REJECTED',
                },
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRejectApplication());

      let rejectResult: any;
      await act(async () => {
        rejectResult = await result.current.reject('app-001');
      });

      expect(rejectResult.success).toBe(true);
      expect(mockMutate).toHaveBeenCalledWith({
        variables: {
          input: { applicationId: 'app-001', message: undefined },
        },
      });
    });

    it('should pass rejection message', async () => {
      const mockResponse = {
        data: {
          tenant: {
            application: {
              reject: {
                success: true,
                message: null,
                application: {
                  id: 'app-001',
                  status: 'REJECTED',
                },
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRejectApplication());

      await act(async () => {
        await result.current.reject('app-001', 'Sorry, cannot accept at this time');
      });

      expect(mockMutate).toHaveBeenCalledWith({
        variables: {
          input: {
            applicationId: 'app-001',
            message: 'Sorry, cannot accept at this time',
          },
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
              reject: {
                success: false,
                message: 'application not found',
                application: null,
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRejectApplication());

      let rejectResult: any;
      await act(async () => {
        rejectResult = await result.current.reject('non-existent');
      });

      expect(rejectResult.success).toBe(false);
      expect(rejectResult.message).toBe('application not found');
    });
  });

  describe('when application is not pending', () => {
    it('should return error result', async () => {
      const mockResponse = {
        data: {
          tenant: {
            application: {
              reject: {
                success: false,
                message: 'application is not pending',
                application: null,
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRejectApplication());

      let rejectResult: any;
      await act(async () => {
        rejectResult = await result.current.reject('app-already-rejected');
      });

      expect(rejectResult.success).toBe(false);
      expect(rejectResult.message).toBe('application is not pending');
    });
  });

  describe('when mutation fails', () => {
    it('should return error result', async () => {
      mockMutate.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useRejectApplication());

      let rejectResult: any;
      await act(async () => {
        rejectResult = await result.current.reject('app-001');
      });

      expect(rejectResult.success).toBe(false);
      expect(rejectResult.message).toBe('Network error');
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

      const { result } = renderHook(() => useRejectApplication());

      let rejectResult: any;
      await act(async () => {
        rejectResult = await result.current.reject('app-001');
      });

      expect(rejectResult.success).toBe(false);
      expect(rejectResult.message).toBe('Unexpected response');
    });
  });

  describe('loading state', () => {
    it('should reflect loading state from mutation', () => {
      mockUseMutation.mockReturnValue([mockMutate, { loading: true }] as any);

      const { result } = renderHook(() => useRejectApplication());

      expect(result.current.loading).toBe(true);
    });
  });
});
