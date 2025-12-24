import type { IronSession } from 'iron-session';

import type { AACClient } from '../../internal/aac';
import type { SessionData } from '../../types';
import type { ChangePasswordResult, ForgotPasswordResult, ResetPasswordResult } from '../types';

/**
 * Create forgotPassword API method
 *
 * Sends password reset email. Always returns success to prevent email enumeration.
 */
export const createForgotPassword =
  (authClient: AACClient) =>
  async (email: string): Promise<ForgotPasswordResult> => {
    try {
      const result = await authClient.forgotPassword(email);
      return {
        success: result.success,
        message: result.message ?? 'If this email exists, a reset link has been sent',
      };
    } catch (error) {
      // Always return success to prevent email enumeration
      console.error('[auth] forgotPassword error:', error);
      return {
        success: true,
        message: 'If this email exists, a reset link has been sent',
      };
    }
  };

/**
 * Create resetPassword API method
 *
 * Resets password using token from email.
 */
export const createResetPassword =
  (authClient: AACClient) =>
  async (token: string, newPassword: string): Promise<ResetPasswordResult> => {
    try {
      const result = await authClient.resetPassword(token, newPassword);
      if (result.success) {
        return {
          success: true,
          message: result.message ?? 'Password reset successfully',
        };
      }
      return {
        success: false,
        error: result.message ?? 'Failed to reset password',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reset password',
      };
    }
  };

/**
 * Create changePassword API method
 *
 * Changes password for authenticated user. Requires valid session.
 */
export const createChangePassword =
  (authClient: AACClient) =>
  async (
    currentPassword: string,
    newPassword: string,
    session: IronSession<SessionData>
  ): Promise<ChangePasswordResult> => {
    // Check if user is authenticated
    if (!session.accessToken) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    try {
      const result = await authClient.changePassword(currentPassword, newPassword, session.accessToken);
      if (result.success) {
        return {
          success: true,
          message: result.message ?? 'Password changed successfully',
        };
      }
      return {
        success: false,
        error: result.message ?? 'Failed to change password',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to change password',
      };
    }
  };
