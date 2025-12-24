import { act, renderHook } from '@testing-library/react';

import { useAcceptInvite } from '../useAcceptInvite';

// Mock @apollo/client/react
jest.mock('@apollo/client/react', () => ({
  useMutation: jest.fn(),
}));

import { useMutation } from '@apollo/client/react';

const mockUseMutation = useMutation as jest.MockedFunction<typeof useMutation>;

describe('useAcceptInvite', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMutation.mockReturnValue([mockMutate, { loading: false }] as any);
  });

  describe('initial state', () => {
    it('should return initial state with loading false', () => {
      const { result } = renderHook(() => useAcceptInvite());

      expect(result.current.loading).toBe(false);
      expect(typeof result.current.accept).toBe('function');
    });
  });

  describe('when accepting invite successfully', () => {
    it('should return success result with membership', async () => {
      const mockResponse = {
        data: {
          tenant: {
            invite: {
              accept: {
                success: true,
                membership: {
                  subject: '019388d3-b1b3-7abc-9def-0123456789ab',
                  tenant: { id: 'tenant-001', name: 'Test Tenant' },
                  role: 'member',
                  createdAt: '2024-12-24T00:00:00Z',
                },
                error: null,
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAcceptInvite());

      let acceptResult: any;
      await act(async () => {
        acceptResult = await result.current.accept('valid-token');
      });

      expect(acceptResult.success).toBe(true);
      expect(acceptResult.membership?.tenant.name).toBe('Test Tenant');
      expect(acceptResult.membership?.role).toBe('member');
    });
  });

  describe('when invite is already accepted', () => {
    it('should return error result', async () => {
      const mockResponse = {
        data: {
          tenant: {
            invite: {
              accept: {
                success: false,
                membership: null,
                error: { code: 'ALREADY_ACCEPTED', message: 'Invite already accepted' },
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAcceptInvite());

      let acceptResult: any;
      await act(async () => {
        acceptResult = await result.current.accept('used-token');
      });

      expect(acceptResult.success).toBe(false);
      expect(acceptResult.error?.code).toBe('ALREADY_ACCEPTED');
    });
  });

  describe('when email does not match', () => {
    it('should return email mismatch error', async () => {
      const mockResponse = {
        data: {
          tenant: {
            invite: {
              accept: {
                success: false,
                membership: null,
                error: { code: 'EMAIL_MISMATCH', message: 'Email does not match' },
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAcceptInvite());

      let acceptResult: any;
      await act(async () => {
        acceptResult = await result.current.accept('test-token');
      });

      expect(acceptResult.success).toBe(false);
      expect(acceptResult.error?.code).toBe('EMAIL_MISMATCH');
    });
  });

  describe('when invite is expired', () => {
    it('should return expired error', async () => {
      const mockResponse = {
        data: {
          tenant: {
            invite: {
              accept: {
                success: false,
                membership: null,
                error: { code: 'EXPIRED', message: 'Invite has expired' },
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAcceptInvite());

      let acceptResult: any;
      await act(async () => {
        acceptResult = await result.current.accept('expired-token');
      });

      expect(acceptResult.success).toBe(false);
      expect(acceptResult.error?.code).toBe('EXPIRED');
    });
  });

  describe('when user is already a member', () => {
    it('should return already member error', async () => {
      const mockResponse = {
        data: {
          tenant: {
            invite: {
              accept: {
                success: false,
                membership: null,
                error: { code: 'ALREADY_MEMBER', message: 'Already a member' },
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAcceptInvite());

      let acceptResult: any;
      await act(async () => {
        acceptResult = await result.current.accept('test-token');
      });

      expect(acceptResult.success).toBe(false);
      expect(acceptResult.error?.code).toBe('ALREADY_MEMBER');
    });
  });

  describe('when mutation fails', () => {
    it('should return error result', async () => {
      mockMutate.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAcceptInvite());

      let acceptResult: any;
      await act(async () => {
        acceptResult = await result.current.accept('test-token');
      });

      expect(acceptResult.success).toBe(false);
      expect(acceptResult.error?.message).toBe('Network error');
    });
  });

  describe('loading state', () => {
    it('should reflect loading state from mutation', () => {
      mockUseMutation.mockReturnValue([mockMutate, { loading: true }] as any);

      const { result } = renderHook(() => useAcceptInvite());

      expect(result.current.loading).toBe(true);
    });
  });
});
