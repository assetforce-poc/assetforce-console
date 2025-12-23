import { renderHook, act } from '@testing-library/react';

import { useSendInvite } from '../useSendInvite';

// Mock @apollo/client/react
jest.mock('@apollo/client/react', () => ({
  useMutation: jest.fn(),
}));

import { useMutation } from '@apollo/client/react';

const mockUseMutation = useMutation as jest.MockedFunction<typeof useMutation>;

describe('useSendInvite', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMutation.mockReturnValue([mockMutate, { loading: false }] as any);
  });

  describe('initial state', () => {
    it('should return initial state with loading false', () => {
      const { result } = renderHook(() => useSendInvite());

      expect(result.current.loading).toBe(false);
      expect(typeof result.current.send).toBe('function');
    });
  });

  describe('when sending invite successfully', () => {
    it('should return success result with invite', async () => {
      const mockResponse = {
        data: {
          tenant: {
            invite: {
              send: {
                success: true,
                invite: {
                  id: 'invite-123',
                  tenantId: 'tenant-001',
                  tenantName: 'Test Tenant',
                  invitedEmail: 'newuser@example.com',
                  role: 'member',
                  expiresAt: '2025-01-01T00:00:00Z',
                  createdAt: '2024-12-24T00:00:00Z',
                },
                error: null,
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSendInvite());

      let sendResult: any;
      await act(async () => {
        sendResult = await result.current.send({
          tenantId: 'tenant-001',
          email: 'newuser@example.com',
          role: 'member',
        });
      });

      expect(sendResult.success).toBe(true);
      expect(sendResult.invite?.invitedEmail).toBe('newuser@example.com');
      expect(mockMutate).toHaveBeenCalledWith({
        variables: {
          input: {
            tenantId: 'tenant-001',
            email: 'newuser@example.com',
            role: 'member',
          },
        },
      });
    });

    it('should send invite with optional message', async () => {
      const mockResponse = {
        data: {
          tenant: {
            invite: {
              send: {
                success: true,
                invite: {
                  id: 'invite-123',
                  tenantId: 'tenant-001',
                  tenantName: 'Test Tenant',
                  invitedEmail: 'newuser@example.com',
                },
                error: null,
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSendInvite());

      await act(async () => {
        await result.current.send({
          tenantId: 'tenant-001',
          email: 'newuser@example.com',
          message: 'Welcome to the team!',
        });
      });

      expect(mockMutate).toHaveBeenCalledWith({
        variables: {
          input: {
            tenantId: 'tenant-001',
            email: 'newuser@example.com',
            message: 'Welcome to the team!',
          },
        },
      });
    });
  });

  describe('when duplicate pending invite exists', () => {
    it('should return duplicate pending error', async () => {
      const mockResponse = {
        data: {
          tenant: {
            invite: {
              send: {
                success: false,
                invite: null,
                error: { code: 'DUPLICATE_PENDING', message: 'Pending invite already exists' },
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSendInvite());

      let sendResult: any;
      await act(async () => {
        sendResult = await result.current.send({
          tenantId: 'tenant-001',
          email: 'existing@example.com',
        });
      });

      expect(sendResult.success).toBe(false);
      expect(sendResult.error?.code).toBe('DUPLICATE_PENDING');
    });
  });

  describe('when user is already a member', () => {
    it('should return already member error', async () => {
      const mockResponse = {
        data: {
          tenant: {
            invite: {
              send: {
                success: false,
                invite: null,
                error: { code: 'ALREADY_MEMBER', message: 'User is already a member' },
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSendInvite());

      let sendResult: any;
      await act(async () => {
        sendResult = await result.current.send({
          tenantId: 'tenant-001',
          email: 'member@example.com',
        });
      });

      expect(sendResult.success).toBe(false);
      expect(sendResult.error?.code).toBe('ALREADY_MEMBER');
    });
  });

  describe('when rate limited', () => {
    it('should return rate limited error', async () => {
      const mockResponse = {
        data: {
          tenant: {
            invite: {
              send: {
                success: false,
                invite: null,
                error: { code: 'RATE_LIMITED', message: 'Too many invites sent' },
              },
            },
          },
        },
      };

      mockMutate.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSendInvite());

      let sendResult: any;
      await act(async () => {
        sendResult = await result.current.send({
          tenantId: 'tenant-001',
          email: 'newuser@example.com',
        });
      });

      expect(sendResult.success).toBe(false);
      expect(sendResult.error?.code).toBe('RATE_LIMITED');
    });
  });

  describe('when mutation fails', () => {
    it('should return error result', async () => {
      mockMutate.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useSendInvite());

      let sendResult: any;
      await act(async () => {
        sendResult = await result.current.send({
          tenantId: 'tenant-001',
          email: 'newuser@example.com',
        });
      });

      expect(sendResult.success).toBe(false);
      expect(sendResult.error?.message).toBe('Network error');
    });
  });

  describe('loading state', () => {
    it('should reflect loading state from mutation', () => {
      mockUseMutation.mockReturnValue([mockMutate, { loading: true }] as any);

      const { result } = renderHook(() => useSendInvite());

      expect(result.current.loading).toBe(true);
    });
  });
});
