import type { IronSession } from 'iron-session';

import { type AuthClient, fromPreAuthResult } from '../../internal/aac';
import { assignSessionData } from '../../internal/session';
import type { SessionData } from '../../types';
import type { SessionWithPendingSubject, SignInCredentials, SignInResult } from '../types';

/**
 * Create signIn API method
 */
export const createSignIn =
  (authClient: AuthClient) =>
  async (credentials: SignInCredentials, session: IronSession<SessionData>): Promise<SignInResult> => {
    try {
      const result = await authClient.authenticate(credentials.username, credentials.password);
      const authResult = fromPreAuthResult(result);

      if (!authResult.success) {
        return { success: false, error: authResult.error };
      }

      // Multi-tenant: requires selection
      if (authResult.requiresTenantSelection) {
        session.pendingTenantSelection = true;
        session.availableTenants = authResult.availableTenants;
        (session as SessionWithPendingSubject)._pendingSubject = authResult.subject;
        await session.save();

        return {
          success: true,
          requiresTenantSelection: true,
          subject: authResult.subject,
          availableTenants: authResult.availableTenants,
        };
      }

      // Single tenant: got session data
      if (authResult.sessionData) {
        assignSessionData(session, authResult.sessionData);
        await session.save();
        return { success: true };
      }

      return { success: false, error: 'Invalid authentication response' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  };
