import type { IronSession } from 'iron-session';

import type { AuthClient } from '../../internal/aac';
import type { SessionData } from '../../types';

/**
 * Create signOut API method
 */
export const createSignOut =
  (authClient: AuthClient) =>
  async (session: IronSession<SessionData>): Promise<void> => {
    try {
      if (session.accessToken) {
        await authClient.logout(session.accessToken);
      }
    } catch {
      // Ignore logout errors
    }
    session.destroy();
  };
