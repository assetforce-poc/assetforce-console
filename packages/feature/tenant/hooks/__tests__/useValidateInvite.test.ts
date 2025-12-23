import { renderHook } from '@testing-library/react';

import { useValidateInvite } from '../useValidateInvite';

// Mock @apollo/client/react
jest.mock('@apollo/client/react', () => ({
  useQuery: jest.fn(),
}));

import { useQuery } from '@apollo/client/react';

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

describe('useValidateInvite', () => {
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

      const { result } = renderHook(() => useValidateInvite({ token: 'test-token' }));

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();
    });
  });

  describe('when token is valid', () => {
    it('should return valid invite data', () => {
      const mockData = {
        tenant: {
          invite: {
            valid: true,
            invite: {
              id: 'invite-123',
              tenantId: 'tenant-001',
              tenantName: 'Test Tenant',
              invitedEmail: 'user@example.com',
              inviterEmail: 'admin@example.com',
              role: 'member',
              message: 'Welcome!',
              status: 'PENDING',
              expiresAt: '2025-01-01T00:00:00Z',
              createdAt: '2024-12-24T00:00:00Z',
              updatedAt: '2024-12-24T00:00:00Z',
            },
            error: null,
            auth: { required: false },
            email: { match: true, invited: 'user@example.com', current: 'user@example.com' },
          },
        },
      };

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useValidateInvite({ token: 'valid-token' }));

      expect(result.current.loading).toBe(false);
      expect(result.current.data?.valid).toBe(true);
      expect(result.current.data?.invite?.tenantName).toBe('Test Tenant');
      expect(result.current.data?.email?.match).toBe(true);
    });
  });

  describe('when token is invalid', () => {
    it('should return error data', () => {
      const mockData = {
        tenant: {
          invite: {
            valid: false,
            invite: null,
            error: { code: 'INVALID_TOKEN', message: 'Token is invalid' },
            auth: { required: false },
            email: null,
          },
        },
      };

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useValidateInvite({ token: 'invalid-token' }));

      expect(result.current.loading).toBe(false);
      expect(result.current.data?.valid).toBe(false);
      expect(result.current.data?.error?.code).toBe('INVALID_TOKEN');
    });
  });

  describe('when token is expired', () => {
    it('should return expired error', () => {
      const mockData = {
        tenant: {
          invite: {
            valid: false,
            invite: null,
            error: { code: 'EXPIRED', message: 'Invite has expired' },
            auth: { required: false },
            email: null,
          },
        },
      };

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useValidateInvite({ token: 'expired-token' }));

      expect(result.current.data?.valid).toBe(false);
      expect(result.current.data?.error?.code).toBe('EXPIRED');
    });
  });

  describe('when authentication is required', () => {
    it('should indicate auth requirement', () => {
      const mockData = {
        tenant: {
          invite: {
            valid: true,
            invite: {
              id: 'invite-123',
              tenantId: 'tenant-001',
              tenantName: 'Test Tenant',
              invitedEmail: 'user@example.com',
              status: 'PENDING',
              expiresAt: '2025-01-01T00:00:00Z',
              createdAt: '2024-12-24T00:00:00Z',
              updatedAt: '2024-12-24T00:00:00Z',
            },
            error: null,
            auth: { required: true },
            email: null,
          },
        },
      };

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useValidateInvite({ token: 'test-token' }));

      expect(result.current.data?.auth.required).toBe(true);
    });
  });

  describe('when email does not match', () => {
    it('should indicate email mismatch', () => {
      const mockData = {
        tenant: {
          invite: {
            valid: true,
            invite: {
              id: 'invite-123',
              tenantId: 'tenant-001',
              tenantName: 'Test Tenant',
              invitedEmail: 'invited@example.com',
              status: 'PENDING',
              expiresAt: '2025-01-01T00:00:00Z',
              createdAt: '2024-12-24T00:00:00Z',
              updatedAt: '2024-12-24T00:00:00Z',
            },
            error: null,
            auth: { required: false },
            email: { match: false, invited: 'invited@example.com', current: 'different@example.com' },
          },
        },
      };

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useValidateInvite({ token: 'test-token' }));

      expect(result.current.data?.email?.match).toBe(false);
      expect(result.current.data?.email?.invited).toBe('invited@example.com');
      expect(result.current.data?.email?.current).toBe('different@example.com');
    });
  });

  describe('when skip option is true', () => {
    it('should skip query execution', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
        refetch: jest.fn(),
      } as any);

      renderHook(() => useValidateInvite({ token: 'test-token', skip: true }));

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ skip: true })
      );
    });
  });

  describe('when network error occurs', () => {
    it('should return error state', () => {
      const mockError = new Error('Network error');

      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: mockError,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useValidateInvite({ token: 'test-token' }));

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBeNull();
    });
  });
});
