import type { IronSession } from 'iron-session';

import { type AuthClient, fromAuthResult } from '../../internal/aac';
import { assignSessionData } from '../../internal/session';
import type { SessionData } from '../../types';
import type { RefreshResult } from '../types';

/**
 * Create refresh API method
 */
export const createRefresh =
  (authClient: AuthClient) =>
  async (session: IronSession<SessionData>): Promise<RefreshResult> => {
    if (!session.refreshToken) {
      return { success: false, error: 'No refresh token available' };
    }

    try {
      const result = await authClient.refreshToken(session.refreshToken);

      if (!result.success) {
        return { success: false, error: result.error || 'Token refresh failed' };
      }

      const sessionData = fromAuthResult(result);
      if (!sessionData) {
        return { success: false, error: 'Invalid refresh response' };
      }

      assignSessionData(session, sessionData);
      await session.save();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed',
      };
    }
  };
