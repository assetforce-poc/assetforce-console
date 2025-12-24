import type { IronSession } from 'iron-session';

import type { AACClient, PasswordResult } from '../../internal/aac';
import type { SessionData } from '../../types';
import { createChangePassword, createForgotPassword, createResetPassword } from './api';

// Mock session implementation
const createMockSession = (accessToken?: string): IronSession<SessionData> => {
  const data: Partial<SessionData> = {
    accessToken,
  };

  return {
    get accessToken() {
      return data.accessToken;
    },
    set accessToken(value) {
      data.accessToken = value;
    },
    save: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn(),
    updateConfig: jest.fn(),
  } as any;
};

// Mock AACClient
const createMockAACClient = (overrides?: Partial<AACClient>): AACClient =>
  ({
    authenticate: jest.fn(),
    selectTenant: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    changePassword: jest.fn(),
    ...overrides,
  }) as any;

describe('Password API - Unit Tests', () => {
  describe('forgotPassword', () => {
    it('should return success when email exists', async () => {
      const mockResult: PasswordResult = {
        success: true,
        message: 'Password reset email sent',
      };

      const authClient = createMockAACClient({
        forgotPassword: jest.fn().mockResolvedValue(mockResult),
      });

      const forgotPassword = createForgotPassword(authClient as any);
      const result = await forgotPassword('test@example.com');

      expect(result.success).toBe(true);
      expect(result.message).toContain('reset');
      expect(authClient.forgotPassword).toHaveBeenCalledWith('test@example.com');
    });

    it('should return success even when email does not exist (prevent enumeration)', async () => {
      const mockResult: PasswordResult = {
        success: true,
        message: 'If this email exists, a reset link has been sent',
      };

      const authClient = createMockAACClient({
        forgotPassword: jest.fn().mockResolvedValue(mockResult),
      });

      const forgotPassword = createForgotPassword(authClient as any);
      const result = await forgotPassword('nonexistent@example.com');

      expect(result.success).toBe(true);
    });

    it('should return success even when API throws error (prevent enumeration)', async () => {
      const authClient = createMockAACClient({
        forgotPassword: jest.fn().mockRejectedValue(new Error('Network error')),
      });

      const forgotPassword = createForgotPassword(authClient as any);
      const result = await forgotPassword('test@example.com');

      // Should still return success to prevent email enumeration
      expect(result.success).toBe(true);
      expect(result.message).toContain('If this email exists');
    });
  });

  describe('resetPassword', () => {
    it('should return success when token is valid', async () => {
      const mockResult: PasswordResult = {
        success: true,
        message: 'Password reset successfully',
      };

      const authClient = createMockAACClient({
        resetPassword: jest.fn().mockResolvedValue(mockResult),
      });

      const resetPassword = createResetPassword(authClient as any);
      const result = await resetPassword('valid-token', 'NewPassword123!');

      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully');
      expect(authClient.resetPassword).toHaveBeenCalledWith('valid-token', 'NewPassword123!');
    });

    it('should return error when token is invalid', async () => {
      const mockResult: PasswordResult = {
        success: false,
        message: 'INVALID_TOKEN',
      };

      const authClient = createMockAACClient({
        resetPassword: jest.fn().mockResolvedValue(mockResult),
      });

      const resetPassword = createResetPassword(authClient as any);
      const result = await resetPassword('invalid-token', 'NewPassword123!');

      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_TOKEN');
    });

    it('should return error when token is expired', async () => {
      const mockResult: PasswordResult = {
        success: false,
        message: 'TOKEN_EXPIRED',
      };

      const authClient = createMockAACClient({
        resetPassword: jest.fn().mockResolvedValue(mockResult),
      });

      const resetPassword = createResetPassword(authClient as any);
      const result = await resetPassword('expired-token', 'NewPassword123!');

      expect(result.success).toBe(false);
      expect(result.error).toBe('TOKEN_EXPIRED');
    });

    it('should handle API errors', async () => {
      const authClient = createMockAACClient({
        resetPassword: jest.fn().mockRejectedValue(new Error('Network error')),
      });

      const resetPassword = createResetPassword(authClient as any);
      const result = await resetPassword('token', 'NewPassword123!');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('changePassword', () => {
    it('should return success when authenticated and password is correct', async () => {
      const mockResult: PasswordResult = {
        success: true,
        message: 'Password changed successfully',
      };

      const authClient = createMockAACClient({
        changePassword: jest.fn().mockResolvedValue(mockResult),
      });

      const changePassword = createChangePassword(authClient as any);
      const session = createMockSession('valid-access-token');

      const result = await changePassword('OldPassword123!', 'NewPassword123!', session);

      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully');
      expect(authClient.changePassword).toHaveBeenCalledWith(
        'OldPassword123!',
        'NewPassword123!',
        'valid-access-token'
      );
    });

    it('should return error when not authenticated', async () => {
      const authClient = createMockAACClient();
      const changePassword = createChangePassword(authClient as any);
      const session = createMockSession(); // No access token

      const result = await changePassword('OldPassword123!', 'NewPassword123!', session);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
      expect(authClient.changePassword).not.toHaveBeenCalled();
    });

    it('should return error when current password is wrong', async () => {
      const mockResult: PasswordResult = {
        success: false,
        message: 'INVALID_CURRENT_PASSWORD',
      };

      const authClient = createMockAACClient({
        changePassword: jest.fn().mockResolvedValue(mockResult),
      });

      const changePassword = createChangePassword(authClient as any);
      const session = createMockSession('valid-access-token');

      const result = await changePassword('WrongPassword', 'NewPassword123!', session);

      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_CURRENT_PASSWORD');
    });

    it('should return error when new password is same as current', async () => {
      const mockResult: PasswordResult = {
        success: false,
        message: 'NEW_PASSWORD_SAME_AS_CURRENT',
      };

      const authClient = createMockAACClient({
        changePassword: jest.fn().mockResolvedValue(mockResult),
      });

      const changePassword = createChangePassword(authClient as any);
      const session = createMockSession('valid-access-token');

      const result = await changePassword('SamePassword!', 'SamePassword!', session);

      expect(result.success).toBe(false);
      expect(result.error).toBe('NEW_PASSWORD_SAME_AS_CURRENT');
    });

    it('should handle API errors', async () => {
      const authClient = createMockAACClient({
        changePassword: jest.fn().mockRejectedValue(new Error('Server error')),
      });

      const changePassword = createChangePassword(authClient as any);
      const session = createMockSession('valid-access-token');

      const result = await changePassword('OldPassword123!', 'NewPassword123!', session);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Server error');
    });
  });
});
